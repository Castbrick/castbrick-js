import type {
  PublicPushConfig,
  SubscribeWebPushOptions,
  SubscribeWebPushResult,
} from "./types.js";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function arrayBufferToBase64Url(buffer: ArrayBuffer | null): string | null {
  if (!buffer) return null;
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function detectClientInfo(): { browser: string; os: string; deviceType: string } {
  if (typeof navigator === "undefined") {
    return { browser: "Unknown", os: "Unknown", deviceType: "Desktop" };
  }

  const ua = navigator.userAgent;
  let browser = "Other";
  if (ua.includes("Firefox/")) browser = "Firefox";
  else if (ua.includes("Edg/")) browser = "Edge";
  else if (ua.includes("Chrome/") && !ua.includes("Edg/")) browser = "Chrome";
  else if (ua.includes("Safari/") && !ua.includes("Chrome/")) browser = "Safari";

  let os = "Other";
  if (ua.includes("Mac OS") || ua.includes("Macintosh")) os = "macOS";
  else if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
  else if (ua.includes("Linux")) os = "Linux";

  let deviceType = "Desktop";
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    deviceType = /(iPad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/i.test(ua)
      ? "Tablet"
      : "Mobile";
  }

  return { browser, os, deviceType };
}

/**
 * Client-side Web Push Manager for browser applications.
 * Handles zero-configuration service worker registration, browser permission,
 * and subscription registration with CastBrick.
 */
export class CastBrickWebPush {
  private static readonly STORAGE_KEY = "cb_push_sub_id";

  /** Checks if the current browser environment supports Web Push Notifications */
  static isSupported(): boolean {
    return (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window
    );
  }

  /** Returns current permission status ('default' | 'granted' | 'denied') */
  static getPermission(): NotificationPermission | "unsupported" {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return "unsupported";
    }
    return Notification.permission;
  }

  /** Returns stored CastBrick subscription ID for this device if previously registered */
  static getSubscriptionId(): string | null {
    if (typeof localStorage === "undefined") return null;
    return localStorage.getItem(this.STORAGE_KEY);
  }

  /**
   * Request push permission, register Service Worker, and subscribe this device to CastBrick Push.
   *
   * @example
   * ```ts
   * import { CastBrickWebPush } from "castbrick-js";
   *
   * const result = await CastBrickWebPush.subscribe({
   *   appId: "app_7a8b9c",
   *   externalUserId: "user_42",
   *   tags: { plan: "enterprise" }
   * });
   *
   * if (result.success) {
   *   console.log("Subscribed with ID:", result.subscriptionId);
   * }
   * ```
   */
  static async subscribe(
    options: SubscribeWebPushOptions
  ): Promise<SubscribeWebPushResult> {
    if (!this.isSupported()) {
      return {
        success: false,
        error: "Web Push is not supported in this browser",
      };
    }

    try {
      // 1. Request notification permission
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        return {
          success: false,
          error: `Notification permission was ${permission}`,
        };
      }

      const apiBase = (
        options.apiBaseUrl ?? "https://api.castbrick.co/v1"
      ).replace(/\/$/, "");

      // 2. Fetch VAPID public key
      const configRes = await fetch(
        `${apiBase}/push/public/config?appId=${encodeURIComponent(options.appId)}`
      );
      if (!configRes.ok) {
        return {
          success: false,
          error: `Failed to fetch push config: HTTP ${configRes.status}`,
        };
      }
      const config = (await configRes.json()) as PublicPushConfig;

      // 3. Register Service Worker
      const workerUrl = options.workerUrl ?? `${apiBase}/push/worker.js`;
      const registration = await navigator.serviceWorker.register(workerUrl, {
        scope: "/",
      });
      await navigator.serviceWorker.ready;

      // 4. Subscribe to Push Manager
      const applicationServerKey = urlBase64ToUint8Array(config.vapidPublicKey);
      let sub = await registration.pushManager.getSubscription();
      if (!sub) {
        sub = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey as unknown as BufferSource,
        });
      }

      // 5. Extract keys
      const p256dh = arrayBufferToBase64Url(sub.getKey("p256dh"));
      const auth = arrayBufferToBase64Url(sub.getKey("auth"));
      const { browser, os, deviceType } = detectClientInfo();

      // 6. Register subscription with CastBrick API
      const registerRes = await fetch(`${apiBase}/push/public/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appId: options.appId,
          platform: "Web",
          endpoint: sub.endpoint,
          p256dhKey: p256dh,
          authKey: auth,
          externalUserId: options.externalUserId ?? null,
          tags: options.tags ?? {},
          browser,
          os,
          deviceType,
        }),
      });

      if (!registerRes.ok) {
        const errText = await registerRes.text();
        return {
          success: false,
          error: `Registration failed: HTTP ${registerRes.status} ${errText}`,
        };
      }

      const resData = (await registerRes.json()) as {
        subscriptionId: string;
        status: string;
      };

      if (typeof localStorage !== "undefined") {
        localStorage.setItem(this.STORAGE_KEY, resData.subscriptionId);
      }

      return {
        success: true,
        subscriptionId: resData.subscriptionId,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message ?? "An unexpected error occurred during subscription",
      };
    }
  }
}
