import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { CastBrick, CastBrickApiError } from '../dist/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_URL = process.env.CASTBRICK_BASE_URL || 'http://127.0.0.1:8787/v1';
const API_KEY = process.env.CASTBRICK_API_KEY || 'test_api_key';

let mockProc = null;

test.before(async () => {
  try {
    const healthUrl = BASE_URL.replace(/\/v1\/?$/, '') + '/health';
    const res = await fetch(healthUrl);
    if (res.ok) return;
  } catch {
    // not running
  }
  const serverPath = resolve(__dirname, '../tools/mock-server/server.js');
  mockProc = spawn(process.execPath, [serverPath, '8787'], { stdio: 'ignore' });
  await new Promise((r) => setTimeout(r, 500));
});

test.after(() => {
  if (mockProc) {
    mockProc.kill();
  }
});

test('CastBrick client requires an apiKey', () => {
  assert.throws(
    () => new CastBrick({ apiKey: '' }),
    /apiKey is required/
  );
});

test('CastBrick exposes all resources when initialized', () => {
  const cb = new CastBrick({ apiKey: API_KEY, baseUrl: BASE_URL });
  assert.ok(cb.sms, 'sms resource should exist');
  assert.ok(cb.contacts, 'contacts resource should exist');
  assert.ok(cb.broadcasts, 'broadcasts resource should exist');
  assert.ok(cb.push, 'push resource should exist');
  assert.ok(cb.billing, 'billing resource should exist');
});

test('sms.send dispatches message and returns queued status', async () => {
  const cb = new CastBrick({ apiKey: API_KEY, baseUrl: BASE_URL });
  const res = await cb.sms.send({
    recipients: ['+244923000000'],
    content: 'Automated test SMS',
  });
  assert.ok(res.id, 'Response should contain message id');
  assert.equal(res.status, 'Queued');
  assert.equal(res.recipientsCount, 1);
});

test('sms.list returns paginated results', async () => {
  const cb = new CastBrick({ apiKey: API_KEY, baseUrl: BASE_URL });
  const res = await cb.sms.list({ page: 1, pageSize: 10 });
  assert.ok(Array.isArray(res.items), 'items should be an array');
  assert.ok(res.totalCount >= 1, 'totalCount should be >= 1');
});

test('contacts.create and contacts.list', async () => {
  const cb = new CastBrick({ apiKey: API_KEY, baseUrl: BASE_URL });
  const contact = await cb.contacts.create({
    name: 'Carlos Manuel',
    phone: '+244923111222',
  });
  assert.ok(contact.id, 'contact should have id');
  assert.equal(contact.name, 'Carlos Manuel');

  const list = await cb.contacts.list({ page: 1, pageSize: 5 });
  assert.ok(Array.isArray(list.items));
});

test('broadcasts.create and broadcasts.list', async () => {
  const cb = new CastBrick({ apiKey: API_KEY, baseUrl: BASE_URL });
  const bc = await cb.broadcasts.create({
    name: 'Promo Black Friday',
    content: 'Descontos exclusivos',
  });
  assert.ok(bc.id, 'broadcast should have id');
  assert.equal(bc.status, 'Scheduled');

  const list = await cb.broadcasts.list();
  assert.ok(Array.isArray(list.items));
});

test('push.publish event and push.issueToken', async () => {
  const cb = new CastBrick({ apiKey: API_KEY, baseUrl: BASE_URL });
  const tokenRes = await cb.push.issueToken({ channels: ['notifications'] });
  assert.ok(tokenRes.token, 'token response should include token');

  const pubRes = await cb.push.publish({
    channel: 'notifications',
    event: 'user.signup',
    data: { id: 'u_123' },
  });
  assert.ok(pubRes.messageId, 'publish response should have messageId');
  assert.equal(pubRes.delivered, true);
});

test('billing.getBalance returns credit balance', async () => {
  const cb = new CastBrick({ apiKey: API_KEY, baseUrl: BASE_URL });
  const billing = await cb.billing.getBalance();
  assert.equal(billing.currency, 'AOA');
  assert.equal(typeof billing.balance, 'number');
});

test('CastBrickApiError thrown when API key is invalid (401)', async () => {
  const cb = new CastBrick({ apiKey: 'invalid_key', baseUrl: BASE_URL });
  await assert.rejects(
    async () => {
      await cb.sms.send({ recipients: ['+244923000000'], content: 'fail' });
    },
    (err) => {
      assert.ok(err instanceof CastBrickApiError);
      assert.equal(err.status, 401);
      return true;
    }
  );
});
