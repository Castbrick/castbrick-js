import type { CastBrickClient } from "../client.js";
import type { Contact, ContactList, CreateContactRequest, PagedResult } from "../types.js";
export declare class ContactsResource {
    private readonly client;
    constructor(client: CastBrickClient);
    /** List contacts with optional search */
    list(page?: number, pageSize?: number, search?: string): Promise<PagedResult<Contact>>;
    /** Get a single contact by ID */
    get(id: string): Promise<Contact>;
    /** Create one or more contacts from comma/newline-separated emails or phone numbers */
    create(data: CreateContactRequest): Promise<number>;
    /** Delete a contact */
    delete(id: string): Promise<void>;
    /** List all contact lists */
    listLists(page?: number, pageSize?: number): Promise<PagedResult<ContactList>>;
    /** Get a contact list by ID */
    getList(id: string): Promise<ContactList>;
    /** Create a contact list */
    createList(name: string): Promise<ContactList>;
    /** Add a contact to a list */
    addToList(listId: string, contactId: string): Promise<void>;
    /** Remove a contact from a list */
    removeFromList(listId: string, contactId: string): Promise<void>;
}
//# sourceMappingURL=contacts.d.ts.map