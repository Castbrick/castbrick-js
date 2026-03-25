import type { CastBrickClient } from "../client.js";
import type { PagedResult, SendSmsRequest, SendSmsResponse, SmsMessage } from "../types.js";
export declare class SmsResource {
    private readonly client;
    constructor(client: CastBrickClient);
    /** Send an SMS to one or more recipients */
    send(request: SendSmsRequest): Promise<SendSmsResponse>;
    /** Get a single SMS message by ID */
    get(id: string): Promise<SmsMessage>;
    /** List SMS messages */
    list(page?: number, pageSize?: number): Promise<PagedResult<SmsMessage>>;
    /** Cancel a scheduled SMS */
    cancelScheduled(messageId: string): Promise<void>;
}
//# sourceMappingURL=sms.d.ts.map