import type { CastBrickClient } from "../client.js";
import type { Contact, ContactList, CreateContactRequest, PagedResult } from "../types.js";

export class ContactsResource {
  constructor(private readonly client: CastBrickClient) {}

  /** List contacts with optional search */
  list(page = 1, pageSize = 20, search?: string): Promise<PagedResult<Contact>> {
    const params: Record<string, string | number> = { pageNumber: page, pageSize };
    if (search) params.search = search;
    return this.client.get<PagedResult<Contact>>("/audience/contacts", params);
  }

  /** Get a single contact by ID */
  get(id: string): Promise<Contact> {
    return this.client.get<Contact>(`/audience/contacts/${id}`);
  }

  /** Create one or more contacts from comma/newline-separated phone numbers */
  create(data: CreateContactRequest): Promise<void> {
    return this.client.post<void>("/audience/contacts", data);
  }

  /** Delete a contact */
  delete(id: string): Promise<void> {
    return this.client.delete(`/audience/contacts/${id}`);
  }

  // ─── Lists ───────────────────────────────────────────────────────────────

  /** List all contact lists */
  listLists(page = 1, pageSize = 20): Promise<PagedResult<ContactList>> {
    return this.client.get<PagedResult<ContactList>>("/audience/lists", { pageNumber: page, pageSize });
  }

  /** Get a contact list by ID */
  getList(id: string): Promise<ContactList> {
    return this.client.get<ContactList>(`/audience/lists/${id}`);
  }

  /**
   * Create a contact list. Returns the ID of the created list.
   */
  createList(name: string): Promise<string> {
    return this.client.post<string>("/audience/lists", { name });
  }

  /** Add a contact to a list */
  addToList(listId: string, contactId: string): Promise<void> {
    return this.client.post<void>(`/audience/lists/${listId}/contacts`, { contactId });
  }

  /** Remove a contact from a list */
  removeFromList(listId: string, contactId: string): Promise<void> {
    return this.client.delete(`/audience/lists/${listId}/contacts/${contactId}`);
  }
}
