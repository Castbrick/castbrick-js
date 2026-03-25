import { CastBrickClient } from "./client.js";
import { SmsResource } from "./resources/sms.js";
import { ContactsResource } from "./resources/contacts.js";
import { BroadcastsResource } from "./resources/broadcasts.js";
export { CastBrickApiError } from "./client.js";
/**
 * CastBrick SDK client.
 *
 * @example
 * ```ts
 * import { CastBrick } from "castbrick-sdk";
 *
 * const cb = new CastBrick({ apiKey: "your_api_key_here" });
 *
 * // Send an SMS
 * await cb.sms.send({ recipients: ["+244923000000"], content: "Hello from CastBrick!" });
 *
 * // List contacts
 * const { items } = await cb.contacts.list();
 *
 * // Create and send a broadcast
 * const id = await cb.broadcasts.create({ name: "Promo", message: "50% off today!" });
 * await cb.broadcasts.send(id);
 * ```
 */
export class CastBrick {
    sms;
    contacts;
    broadcasts;
    constructor(options) {
        const client = new CastBrickClient(options);
        this.sms = new SmsResource(client);
        this.contacts = new ContactsResource(client);
        this.broadcasts = new BroadcastsResource(client);
    }
}
//# sourceMappingURL=index.js.map