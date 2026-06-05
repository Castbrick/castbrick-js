# castbrick-js

Official JavaScript/TypeScript SDK for the CastBrick API. Published as `castbrick-js` on npm.

## Commands

```bash
npm run build      # compile TypeScript → dist/
npm run typecheck  # tsc --noEmit
```

## Version

Current: `0.1.3` — bump in `package.json` before releasing.

## Source files

```
src/
├── client.ts          # CastBrickClient (fetch-based, Bearer auth)
├── types.ts           # All exported types and interfaces
├── index.ts           # CastBrick class (entry point)
└── resources/
    ├── sms.ts         # SmsResource
    ├── contacts.ts    # ContactsResource
    └── broadcasts.ts  # BroadcastsResource
```

## API base URL

Default: `https://api.castbrick.co` — **no `/v1`**.

## Correct API facts

- `sms.cancelScheduled(id)` → `DELETE /sms/{id}`
- `contacts.createList(name)` → returns `Promise<string>` (ID), not `Promise<ContactList>`
- `contacts.create({ phoneNumbers })` — no `emails` field
- `sms.list(params: SmsListParams)` — accepts `{ page, pageSize, status, phone, from, to }`
- `sms.send({ ..., fallback?: boolean })` — fallback field supported

## Publishing

Pushing code to `master` triggers GitHub Actions. The workflow runs checks, bumps the
patch version, creates the matching `v*` tag, publishes to npm with provenance, then
pushes the release commit and tag.
Publishing uses npm Trusted Publishing through GitHub Actions OIDC. Do not add an
`NPM_TOKEN` secret for releases.

Configure the package on npmjs.com:

- Package: `castbrick-js`
- Publisher: GitHub Actions
- Owner: `IldySilva`
- Repository: `castbrick-js`
- Workflow: `.github/workflows/publish.yml`

After that, pushing to `master` triggers the release workflow.
