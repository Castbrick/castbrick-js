# Changelog

## 0.1.3 — 2026-06-01

### Bug Fixes
- **`sms.cancelScheduled()`** — fixed endpoint from `POST /sms/cancel-scheduled` to `DELETE /sms/{id}` (was completely broken)
- **`contacts.createList()`** — now correctly returns `Promise<string>` (the new list ID) instead of trying to deserialize a `ContactList` object
- **`contacts.create()`** — removed unsupported `emails` field from `CreateContactRequest`; API only accepts `phoneNumbers`

### New Features
- **`sms.send()`** — added `fallback?: boolean` to `SendSmsRequest` to control sender ID fallback behaviour
- **`sms.list()`** — signature changed to accept a `SmsListParams` object with optional `status`, `phone`, `from` and `to` filters
- **`SmsListParams`** — new exported type for `sms.list()` parameters

### Breaking Changes
- `sms.list(page, pageSize)` → `sms.list({ page, pageSize, status?, phone?, from?, to? })`
- `contacts.create({ emails?, phoneNumbers? })` → `contacts.create({ phoneNumbers? })`

---

## 0.1.2

- Initial release.
