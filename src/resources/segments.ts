import type { CastBrickClient } from "../client.js";
import type { CreateSegmentRequest, PagedResult, Segment, UpdateSegmentRequest } from "../types.js";

export class SegmentsResource {
  constructor(private readonly client: CastBrickClient) {}

  /** List segments for the authenticated workspace */
  list(page = 1, pageSize = 50, search?: string): Promise<PagedResult<Segment>> {
    const params: Record<string, string | number> = { pageNumber: page, pageSize };
    if (search) params.search = search;
    return this.client.get<PagedResult<Segment>>("/audience/segments", params);
  }

  /** Create a new dynamic segment */
  create(data: CreateSegmentRequest): Promise<string> {
    return this.client.post<string>("/audience/segments", data);
  }

  /** Update an existing segment */
  update(id: string, data: UpdateSegmentRequest): Promise<void> {
    return this.client.put<void>(`/audience/segments/${id}`, data);
  }

  /** Delete a segment */
  delete(id: string): Promise<void> {
    return this.client.delete(`/audience/segments/${id}`);
  }
}
