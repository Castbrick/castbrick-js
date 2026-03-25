export type ApiKeyPermission = "Email" | "Sms" | "Full";
export interface CastBrickOptions {
    /** Your CastBrick API key */
    apiKey: string;
    /** Override the API base URL (defaults to https://api.castbrick.com) */
    baseUrl?: string;
}
export interface PagedResult<T> {
    items: T[];
    totalCount: number;
    pageNumber: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}
export interface SendSmsRequest {
    /** Array of E.164 phone numbers, e.g. ["+244923000000"] */
    recipients: string[];
    /** Message content (max 1600 chars) */
    content: string;
    /** Optional SMS sender ID */
    senderId?: string;
    /** Schedule the message for future delivery (ISO 8601) */
    scheduledAt?: string;
    /** Send to all contacts in this list instead of/in addition to `recipients` */
    contactListId?: string;
}
export interface SendSmsResponse {
    messageId: string;
    status: "queued" | "scheduled";
    recipientCount: number;
    error: string | null;
    timestamp: string;
}
export interface SmsMessage {
    id: string;
    phoneNumber: string;
    message: string;
    status: string;
    tenantId: string;
    sentAt: string | null;
    deliveredAt: string | null;
    createdAt: string;
}
export interface Contact {
    id: string;
    name: string | null;
    phoneNumber: string | null;
    email: string | null;
    tenantId: string;
    createdAt: string;
}
export interface CreateContactRequest {
    /** One or more email addresses (comma/newline separated) */
    emails?: string;
    /** One or more phone numbers (comma/newline separated) */
    phoneNumbers?: string;
}
export interface ContactList {
    id: string;
    name: string;
    tenantId: string;
    contactCount: number;
    createdAt: string;
}
export interface Broadcast {
    id: string;
    name: string;
    status: string;
    message: string;
    senderId: string | null;
    contactListId: string | null;
    scheduledAt: string | null;
    createdAt: string;
}
export interface CreateBroadcastRequest {
    name: string;
    message: string;
    contactListId?: string;
    senderId?: string;
}
export interface UpdateBroadcastRequest {
    name: string;
    message: string;
    contactListId?: string;
    senderId?: string;
    scheduleAt?: string;
}
//# sourceMappingURL=types.d.ts.map