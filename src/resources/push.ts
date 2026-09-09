import type { CastBrickClient } from "../client.js";
import type {
  IssuePushTokenRequest,
  IssuePushTokenResponse,
  PublishEventRequest,
  PublishEventResponse,
  SendPushRequest,
  SendPushResponse,
  PushApp,
  CreatePushAppRequest,
  UpdatePushAppCredentialsRequest,
  PushSubscriptionItem,
  PushNotificationItem,
  PushUsage,
} from "../types.js";

export class PushResource {
  constructor(private readonly client: CastBrickClient) {}

  /** Issue a short-lived channel token for browser/mobile clients */
  issueToken(request: IssuePushTokenRequest): Promise<IssuePushTokenResponse> {
    return this.client.post<IssuePushTokenResponse>("/push/tokens", request);
  }

  /** Publish an event to a channel (server → subscribers) */
  publish(request: PublishEventRequest): Promise<PublishEventResponse> {
    return this.client.post<PublishEventResponse>("/push/publish", request);
  }

  /**
   * Send a push notification campaign to subscribers (Web, iOS, Android).
   * Free monthly quota (5,000 pushes) applies automatically per tenant.
   */
  send(request: SendPushRequest): Promise<SendPushResponse> {
    return this.client.post<SendPushResponse>("/push/send", request);
  }

  /** List all Push Apps configured for the current tenant */
  getApps(): Promise<PushApp[]> {
    return this.client.get<PushApp[]>("/push/apps");
  }

  /** Create a new Push App (automatically generates VAPID keypair) */
  createApp(request: CreatePushAppRequest): Promise<PushApp> {
    return this.client.post<PushApp>("/push/apps", request);
  }

  /** Update BYOC credentials for Apple APNs (.p8) and Firebase FCM (service account JSON) */
  updateCredentials(
    appId: string,
    request: UpdatePushAppCredentialsRequest
  ): Promise<void> {
    return this.client.patch<void>(`/push/apps/${appId}/credentials`, request);
  }

  /** Get subscriber devices (Web browsers, iOS, Android) */
  getSubscriptions(params?: {
    appId?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PushSubscriptionItem[]> {
    return this.client.get<PushSubscriptionItem[]>("/push/subscriptions", params);
  }

  /** Get notification delivery history and click statistics */
  getNotifications(params?: {
    appId?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PushNotificationItem[]> {
    return this.client.get<PushNotificationItem[]>("/push/notifications", params);
  }

  /** Get monthly push quota usage and remaining free pushes */
  getUsage(): Promise<PushUsage> {
    return this.client.get<PushUsage>("/push/usage");
  }
}
