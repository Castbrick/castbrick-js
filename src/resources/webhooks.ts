import type { CastBrickClient } from "../client.js";
import type { CreateWebhookRequest, PagedResult, Webhook, WebhookLog } from "../types.js";

export class WebhooksResource {
  constructor(private readonly client: CastBrickClient) {}

  /** List webhooks for the authenticated workspace */
  list(page = 1, pageSize = 10): Promise<PagedResult<Webhook>> {
    return this.client.get<PagedResult<Webhook>>("/webhooks", { pageNumber: page, pageSize });
  }

  /** Get a webhook by ID */
  get(id: string): Promise<Webhook> {
    return this.client.get<Webhook>(`/webhooks/${id}`);
  }

  /** Create/register a new webhook */
  create(data: CreateWebhookRequest): Promise<string> {
    return this.client.post<string>("/webhooks", data);
  }

  /** Toggle the active status of a webhook */
  toggle(id: string): Promise<void> {
    return this.client.put<void>(`/webhooks/${id}/toggle`, {});
  }

  /** Send a sample event payload to verify endpoint connectivity */
  test(webhookId: string, payload: string): Promise<void> {
    return this.client.post<void>("/webhooks/test", { webhookId, payload });
  }

  /** List delivery attempt logs for a specific webhook */
  listLogs(id: string, limit = 50): Promise<WebhookLog[]> {
    return this.client.get<WebhookLog[]>(`/webhooks/${id}/logs`, { limit });
  }

  /** Retry delivery of a failed webhook event by log entry ID */
  retry(logId: string): Promise<void> {
    return this.client.post<void>(`/webhooks/logs/${logId}/retry`, {});
  }

  /** Delete a webhook configuration */
  delete(id: string): Promise<void> {
    return this.client.delete(`/webhooks/${id}`);
  }
}
