import type { CastBrickClient } from "../client.js";
import type { CreateTemplateRequest, PagedResult, Template, UpdateTemplateRequest } from "../types.js";

export class TemplatesResource {
  constructor(private readonly client: CastBrickClient) {}

  /** List templates for the authenticated workspace */
  list(page = 1, pageSize = 20): Promise<PagedResult<Template>> {
    return this.client.get<PagedResult<Template>>("/templates", { page, pageSize });
  }

  /** Create a new template */
  create(data: CreateTemplateRequest): Promise<string> {
    return this.client.post<string>("/templates", data);
  }

  /** Update an existing template */
  update(id: string, data: UpdateTemplateRequest): Promise<string> {
    return this.client.put<string>(`/templates/${id}`, data);
  }

  /** Delete a template */
  delete(id: string): Promise<void> {
    return this.client.delete(`/templates/${id}`);
  }
}
