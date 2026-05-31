export type ApiKeyPermission = "Sms" | "Full";

export interface CastBrickOptions {
  /** Your CastBrick API key */
  apiKey: string;
  /** Override the API base URL (defaults to https://api.castbrick.co) */
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

// ─── SMS ────────────────────────────────────────────────────────────────────

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
  /**
   * Whether to fall back to the CastBrick default sender when the chosen
   * sender ID is unavailable. Defaults to true.
   */
  fallback?: boolean;
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
  contactName: string | null;
  recipientPhone: string;
  message: string;
  campaignName: string | null;
  campaignId: string | null;
  senderId: string | null;
  status: string;
  errorMessage: string | null;
  retryCount: number;
  scheduledAt: string | null;
  sentAt: string | null;
  deliveredAt: string | null;
}

export interface SmsListParams {
  page?: number;
  pageSize?: number;
  status?: string;
  phone?: string;
  from?: string;
  to?: string;
}

// ─── Contacts ───────────────────────────────────────────────────────────────

export interface Contact {
  id: string;
  name: string | null;
  phoneNumber: string | null;
  email: string | null;
  tenantId: string;
  createdAt: string;
}

export interface CreateContactRequest {
  /** One or more phone numbers (comma/newline separated) */
  phoneNumbers?: string;
}

// ─── Contact Lists ───────────────────────────────────────────────────────────

export interface ContactList {
  id: string;
  name: string;
  tenantId: string;
  contactCount: number;
  createdAt: string;
}

// ─── Broadcasts ──────────────────────────────────────────────────────────────

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
