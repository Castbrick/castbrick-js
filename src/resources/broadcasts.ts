import type { CastBrickClient } from "../client.js";
import type { Broadcast, CreateBroadcastRequest, PagedResult, UpdateBroadcastRequest } from "../types.js";

export class BroadcastsResource {
  constructor(private readonly client: CastBrickClient) {}

  /** List broadcasts */
  list(page = 1, pageSize = 20): Promise<PagedResult<Broadcast>> {
    return this.client.get<PagedResult<Broadcast>>("/broadcasts", { pageNumber: page, pageSize });
  }

  /** Get a broadcast by ID */
  get(id: string): Promise<Broadcast> {
    return this.client.get<Broadcast>(`/broadcasts/${id}`);
  }

  /** Create a new broadcast */
  create(data: CreateBroadcastRequest): Promise<string> {
    return this.client.post<string>("/broadcasts", data);
  }

  /** Update an existing broadcast */
  update(id: string, data: UpdateBroadcastRequest): Promise<string> {
    return this.client.put<string>(`/broadcasts/${id}`, data);
  }

  /** Send a broadcast immediately (or schedule it if scheduledAt is set) */
  send(id: string): Promise<void> {
    return this.client.post<void>(`/broadcasts/${id}/send`, {});
  }

  /** Cancel a scheduled or queued broadcast */
  cancel(id: string): Promise<void> {
    return this.client.post<void>(`/broadcasts/${id}/cancel`, {});
  }

  /** Duplicate an existing broadcast */
  duplicate(id: string): Promise<string> {
    return this.client.post<string>(`/broadcasts/${id}/duplicate`, {});
  }

  /** Delete a broadcast */
  delete(id: string): Promise<void> {
    return this.client.delete(`/broadcasts/${id}`);
  }
}
