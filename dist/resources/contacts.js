export class ContactsResource {
    client;
    constructor(client) {
        this.client = client;
    }
    /** List contacts with optional search */
    list(page = 1, pageSize = 20, search) {
        const params = { pageNumber: page, pageSize };
        if (search)
            params.search = search;
        return this.client.get("/audience/contacts", params);
    }
    /** Get a single contact by ID */
    get(id) {
        return this.client.get(`/audience/contacts/${id}`);
    }
    /** Create one or more contacts from comma/newline-separated emails or phone numbers */
    create(data) {
        return this.client.post("/audience/contacts", data);
    }
    /** Delete a contact */
    delete(id) {
        return this.client.delete(`/audience/contacts/${id}`);
    }
    // ─── Lists ───────────────────────────────────────────────────────────────
    /** List all contact lists */
    listLists(page = 1, pageSize = 20) {
        return this.client.get("/audience/lists", { pageNumber: page, pageSize });
    }
    /** Get a contact list by ID */
    getList(id) {
        return this.client.get(`/audience/lists/${id}`);
    }
    /** Create a contact list */
    createList(name) {
        return this.client.post("/audience/lists", { name });
    }
    /** Add a contact to a list */
    addToList(listId, contactId) {
        return this.client.post(`/audience/lists/${listId}/contacts`, { contactId });
    }
    /** Remove a contact from a list */
    removeFromList(listId, contactId) {
        return this.client.delete(`/audience/lists/${listId}/contacts/${contactId}`);
    }
}
//# sourceMappingURL=contacts.js.map