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

// ─── Push ────────────────────────────────────────────────────────────────────

export interface IssuePushTokenRequest {
  channels: string[];
  userId?: string;
  ttlSeconds?: number;
}

export interface IssuePushTokenResponse {
  token: string;
  expiresAt: string;
  channels: string[];
}

export interface PublishEventRequest {
  channel: string;
  event: string;
  data: unknown;
}

export interface PublishEventResponse {
  messageId: string;
  delivered: number;
  creditsUsed: number;
}

export interface PushEvent {
  channel: string;
  event: string;
  data: unknown;
  timestamp: string;
}

export type PushEventHandler = (event: PushEvent) => void;

export type PushClientStatus = "connecting" | "connected" | "disconnected" | "error";

export interface SendPushTarget {
  subscriptionIds?: string[];
  externalUserIds?: string[];
  tags?: Record<string, string>;
  all?: boolean;
}

export interface SendPushRequest {
  appId: string;
  title: string;
  body: string;
  iconUrl?: string;
  imageUrl?: string;
  actionUrl?: string;
  data?: Record<string, unknown>;
  target?: SendPushTarget;
}

export interface SendPushResponse {
  notificationId: string;
  targetedCount: number;
  deliveredCount: number;
  failedCount: number;
  freePushesRemaining: number;
  creditsDeducted: number;
}

export interface PushApp {
  id: string;
  appId: string;
  name: string;
  vapidPublicKey: string;
  hasApns: boolean;
  hasFcm: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface CreatePushAppRequest {
  name: string;
  appId?: string;
}

export interface UpdatePushAppCredentialsRequest {
  apnsKeyId?: string;
  apnsTeamId?: string;
  apnsBundleId?: string;
  apnsPrivateKey?: string;
  fcmServiceAccountJson?: string;
}

export interface PushSubscriptionItem {
  id: string;
  platform: string;
  externalUserId: string | null;
  tagsJson: string;
  browser: string | null;
  os: string | null;
  deviceType: string;
  isActive: boolean;
  lastActiveAt: string;
  createdAt: string;
}

export interface PushNotificationItem {
  id: string;
  title: string;
  body: string;
  iconUrl: string | null;
  imageUrl: string | null;
  actionUrl: string | null;
  totalTargeted: number;
  totalDelivered: number;
  totalFailed: number;
  totalClicked: number;
  creditsDeducted: number;
  status: string;
  sentAt: string | null;
  createdAt: string;
}

export interface PushUsage {
  freeUsed: number;
  freeLimit: number;
  paidUsed: number;
  creditsDeducted: number;
  freeRemaining: number;
}

export interface PublicPushConfig {
  appId: string;
  vapidPublicKey: string;
}

export interface SubscribeWebPushOptions {
  appId: string;
  apiBaseUrl?: string;
  workerUrl?: string;
  externalUserId?: string;
  tags?: Record<string, string>;
}

export interface SubscribeWebPushResult {
  success: boolean;
  subscriptionId?: string;
  error?: string;
}

// ─── Templates ───────────────────────────────────────────────────────────────

export interface Template {
  id: string;
  name: string;
  content: string;
  subject?: string;
  createdAt: string;
}

export interface CreateTemplateRequest {
  name: string;
  content: string;
  subject?: string;
}

export interface UpdateTemplateRequest {
  name: string;
  content: string;
  subject?: string;
}

// ─── Webhooks ────────────────────────────────────────────────────────────────

export interface Webhook {
  id: string;
  endpoint: string;
  eventType: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateWebhookRequest {
  endpoint: string;
  eventType: string;
}

export interface WebhookLog {
  id: string;
  webhookId: string;
  eventType: string;
  statusCode: number;
  attempt: number;
  deliveredAt: string;
}

// ─── Segments ────────────────────────────────────────────────────────────────

export interface Segment {
  id: string;
  name: string;
  description?: string;
  rulesOperator?: "AND" | "OR";
  contactCount: number;
  createdAt: string;
}

export interface CreateSegmentRequest {
  name: string;
  description?: string;
  rulesOperator?: "AND" | "OR";
  rules?: string;
}

export interface UpdateSegmentRequest {
  name: string;
  description?: string;
  rulesOperator?: "AND" | "OR";
  rules?: string;
}

// ─── Billing ─────────────────────────────────────────────────────────────────

export interface BillingBalance {
  balance: number;
  lowBalanceThreshold: number;
  alertEmail: string;
  lastAlertSentAt: string | null;
}

export interface CreditPack {
  id: string;
  name: string;
  credits: number;
  price: number;
  currency: string;
  pricePerSms: number;
}

export interface InitiatePaymentRequest {
  packageId: string;
  provider: "Stripe";
  method: "Card";
  currency: string;
  returnUrl: string;
  cancelUrl: string;
  successUrl: string;
  failureUrl: string;
}

export interface InitiatePaymentResponse {
  paymentUrl: string;
  providerRef: string;
  paymentId: string;
}

export interface PaymentInfo {
  id: string;
  amount: number;
  currency: string;
  status: string;
  providerRef: string;
  creditsGranted: number;
  createdAt: string;
}

export interface CreditLedgerEntry {
  id: string;
  amount: number;
  type: string;
  description: string;
  createdAt: string;
}

