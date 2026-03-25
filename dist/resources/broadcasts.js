export class BroadcastsResource {
    client;
    constructor(client) {
        this.client = client;
    }
    /** List broadcasts */
    list(page = 1, pageSize = 20) {
        return this.client.get("/broadcasts", { pageNumber: page, pageSize });
    }
    /** Get a broadcast by ID */
    get(id) {
        return this.client.get(`/broadcasts/${id}`);
    }
    /** Create a new broadcast */
    create(data) {
        return this.client.post("/broadcasts", data);
    }
    /** Update an existing broadcast */
    update(id, data) {
        return this.client.put(`/broadcasts/${id}`, data);
    }
    /** Send a broadcast immediately (or schedule it if scheduledAt is set) */
    send(id) {
        return this.client.post(`/broadcasts/${id}/send`, {});
    }
    /** Cancel a scheduled or queued broadcast */
    cancel(id) {
        return this.client.post(`/broadcasts/${id}/cancel`, {});
    }
    /** Duplicate an existing broadcast */
    duplicate(id) {
        return this.client.post(`/broadcasts/${id}/duplicate`, {});
    }
    /** Delete a broadcast */
    delete(id) {
        return this.client.delete(`/broadcasts/${id}`);
    }
}
//# sourceMappingURL=broadcasts.js.map