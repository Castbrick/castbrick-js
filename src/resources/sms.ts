import type { CastBrickClient } from "../client.js";
import type { PagedResult, SendSmsRequest, SendSmsResponse, SmsMessage } from "../types.js";

export class SmsResource {
  constructor(private readonly client: CastBrickClient) {}

  /** Send an SMS to one or more recipients */
  send(request: SendSmsRequest): Promise<SendSmsResponse> {
    return this.client.post<SendSmsResponse>("/sms/send", request);
  }

  /** Get a single SMS message by ID */
  get(id: string): Promise<SmsMessage> {
    return this.client.get<SmsMessage>(`/sms/${id}`);
  }

  /** List SMS messages */
  list(page = 1, pageSize = 20): Promise<PagedResult<SmsMessage>> {
    return this.client.get<PagedResult<SmsMessage>>("/sms", { pageNumber: page, pageSize });
  }

  /** Cancel a scheduled SMS */
  cancelScheduled(messageId: string): Promise<void> {
    return this.client.post<void>("/sms/cancel-scheduled", { messageId });
  }
}
