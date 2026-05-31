import type { CastBrickClient } from "../client.js";
import type { PagedResult, SendSmsRequest, SendSmsResponse, SmsListParams, SmsMessage } from "../types.js";

export class SmsResource {
  constructor(private readonly client: CastBrickClient) {}

  /** Send an SMS to one or more recipients */
  send(request: SendSmsRequest): Promise<SendSmsResponse> {
    return this.client.post<SendSmsResponse>("/sms/send", request);
  }

  /** List SMS messages with optional filters */
  list(params: SmsListParams = {}): Promise<PagedResult<SmsMessage>> {
    const { page = 1, pageSize = 20, status, phone, from, to } = params;
    const query: Record<string, string | number> = { pageNumber: page, pageSize };
    if (status) query.status = status;
    if (phone) query.phone = phone;
    if (from) query.from = from;
    if (to) query.to = to;
    return this.client.get<PagedResult<SmsMessage>>("/sms", query);
  }

  /** Cancel a scheduled SMS by its ID */
  cancelScheduled(messageId: string): Promise<void> {
    return this.client.delete(`/sms/${messageId}`);
  }
}
