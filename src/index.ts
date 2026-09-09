import { CastBrickClient } from "./client.js";
import { SmsResource } from "./resources/sms.js";
import { ContactsResource } from "./resources/contacts.js";
import { BroadcastsResource } from "./resources/broadcasts.js";
import { PushResource } from "./resources/push.js";
import { WebhooksResource } from "./resources/webhooks.js";
import { TemplatesResource } from "./resources/templates.js";
import { SegmentsResource } from "./resources/segments.js";
import { BillingResource } from "./resources/billing.js";
import type { CastBrickOptions } from "./types.js";

export { CastBrickApiError } from "./client.js";
export { CastBrickPushClient } from "./push-client.js";
export { CastBrickWebPush } from "./web-push.js";
export type * from "./types.js";

/**
 * CastBrick SDK client (server-side).
 *
 * @example
 * ```ts
 * import { CastBrick } from "castbrick-js";
 *
 * const cb = new CastBrick({ apiKey: "your_api_key_here" });
 *
 * // Send an SMS
 * await cb.sms.send({ recipients: ["+244923000000"], content: "Hello from CastBrick!" });
 *
 * // Issue a Push channel token for a browser client
 * const { token } = await cb.push.issueToken({ channels: ["orders"] });
 *
 * // Publish a push event
 * await cb.push.publish({ channel: "orders", event: "order.created", data: { orderId: "abc" } });
 * ```
 */
export class CastBrick {
  readonly sms: SmsResource;
  readonly contacts: ContactsResource;
  readonly broadcasts: BroadcastsResource;
  readonly push: PushResource;
  readonly webhooks: WebhooksResource;
  readonly templates: TemplatesResource;
  readonly segments: SegmentsResource;
  readonly billing: BillingResource;

  constructor(options: CastBrickOptions) {
    const client = new CastBrickClient(options);
    this.sms = new SmsResource(client);
    this.contacts = new ContactsResource(client);
    this.broadcasts = new BroadcastsResource(client);
    this.push = new PushResource(client);
    this.webhooks = new WebhooksResource(client);
    this.templates = new TemplatesResource(client);
    this.segments = new SegmentsResource(client);
    this.billing = new BillingResource(client);
  }
}
