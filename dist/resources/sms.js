export class SmsResource {
    client;
    constructor(client) {
        this.client = client;
    }
    /** Send an SMS to one or more recipients */
    send(request) {
        return this.client.post("/sms/send", request);
    }
    /** Get a single SMS message by ID */
    get(id) {
        return this.client.get(`/sms/${id}`);
    }
    /** List SMS messages */
    list(page = 1, pageSize = 20) {
        return this.client.get("/sms", { pageNumber: page, pageSize });
    }
    /** Cancel a scheduled SMS */
    cancelScheduled(messageId) {
        return this.client.post("/sms/cancel-scheduled", { messageId });
    }
}
//# sourceMappingURL=sms.js.map