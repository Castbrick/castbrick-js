# @castbrick/js

Official JavaScript/TypeScript SDK for the [CastBrick](https://castbrick.com) API.

## Installation

```bash
npm install @castbrick/js
```

## Requirements

- Node.js 18+ (uses native `fetch`)
- Any modern browser, Next.js, SvelteKit, or Vite project

## Quick Start

```ts
import { CastBrick } from "@castbrick/js";

const cb = new CastBrick({ apiKey: "your_api_key_here" });

// Send an SMS
await cb.sms.send({
  recipients: ["+244923000000"],
  content: "Hello from CastBrick!",
});
```

Get your API key from the [CastBrick dashboard](https://app.castbrick.com/apikeys).

---

## SMS

### Send an SMS

```ts
const result = await cb.sms.send({
  recipients: ["+244923000000", "+244912000000"],
  content: "Your verification code is 1234",
  senderId: "MyApp",         // optional
  scheduledAt: "2026-04-01T10:00:00Z", // optional — schedule for later
});

console.log(result.messageId, result.recipientCount);
```

### Send to a Contact List

```ts
await cb.sms.send({
  recipients: [],
  content: "Promo: 50% off this weekend!",
  contactListId: "list-uuid-here",
});
```

### Get a message

```ts
const message = await cb.sms.get("message-id");
console.log(message.status); // "queued" | "sent" | "delivered" | "failed"
```

### List messages

```ts
const { items, totalCount } = await cb.sms.list(1, 20);
```

### Cancel a scheduled SMS

```ts
await cb.sms.cancelScheduled("message-id");
```

---

## Contacts

### List contacts

```ts
const { items } = await cb.contacts.list(1, 20, "search term");
```

### Create contacts

```ts
// Accepts comma or newline-separated values
await cb.contacts.create({
  phoneNumbers: "+244923000000, +244912000000",
  emails: "user@example.com",
});
```

### Delete a contact

```ts
await cb.contacts.delete("contact-id");
```

### Contact Lists

```ts
// List all contact lists
const { items } = await cb.contacts.listLists();

// Create a list
const list = await cb.contacts.createList("VIP Customers");

// Add / remove a contact from a list
await cb.contacts.addToList(list.id, "contact-id");
await cb.contacts.removeFromList(list.id, "contact-id");
```

---

## Broadcasts

### Create and send a broadcast

```ts
const id = await cb.broadcasts.create({
  name: "Weekend Promo",
  message: "50% off this weekend!",
  contactListId: "list-uuid-here", // optional
  senderId: "MyApp",               // optional
});

await cb.broadcasts.send(id);
```

### Schedule a broadcast

```ts
await cb.broadcasts.update(id, {
  name: "Weekend Promo",
  message: "50% off this weekend!",
  scheduleAt: "2026-04-05T08:00:00Z",
});

await cb.broadcasts.send(id); // sends at the scheduled time
```

### Other broadcast operations

```ts
await cb.broadcasts.cancel(id);
await cb.broadcasts.duplicate(id);
await cb.broadcasts.delete(id);

const { items } = await cb.broadcasts.list();
const broadcast = await cb.broadcasts.get(id);
```

---

## Error Handling

```ts
import { CastBrick, CastBrickApiError } from "@castbrick/js";

try {
  await cb.sms.send({ recipients: ["+244923000000"], content: "Hello!" });
} catch (err) {
  if (err instanceof CastBrickApiError) {
    console.error(`API error ${err.status}:`, err.message);
    // 401 → invalid or revoked API key
    // 402 → insufficient credits
    // 422 → validation error
  }
}
```

---

## Custom Base URL

```ts
const cb = new CastBrick({
  apiKey: "your_api_key_here",
  baseUrl: "http://localhost:5000", // point to a local or staging instance
});
```

---

## TypeScript

The SDK is written in TypeScript and exports all types:

```ts
import type { SendSmsRequest, Broadcast, Contact, PagedResult } from "@castbrick/js";
```

---

## License

MIT
