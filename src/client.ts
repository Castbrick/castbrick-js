import type { CastBrickOptions } from "./types.js";

export class CastBrickClient {
  readonly baseUrl: string;
  private readonly headers: Record<string, string>;

  constructor(options: CastBrickOptions) {
    if (!options.apiKey) throw new Error("CastBrick: apiKey is required");
    this.baseUrl = (options.baseUrl ?? "https://api.castbrick.com").replace(/\/$/, "");
    this.headers = {
      Authorization: `Bearer ${options.apiKey}`,
      "Content-Type": "application/json",
    };
  }

  async get<T>(path: string, params?: Record<string, string | number | boolean>): Promise<T> {
    const url = new URL(this.baseUrl + path);
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
      }
    }
    const res = await fetch(url.toString(), { headers: this.headers });
    return this.handleResponse<T>(res);
  }

  async post<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(this.baseUrl + path, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(body),
    });
    return this.handleResponse<T>(res);
  }

  async put<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(this.baseUrl + path, {
      method: "PUT",
      headers: this.headers,
      body: JSON.stringify(body),
    });
    return this.handleResponse<T>(res);
  }

  async delete(path: string): Promise<void> {
    const res = await fetch(this.baseUrl + path, {
      method: "DELETE",
      headers: this.headers,
    });
    if (!res.ok && res.status !== 204) await this.handleResponse(res);
  }

  private async handleResponse<T>(res: Response): Promise<T> {
    if (res.ok) {
      if (res.status === 204) return undefined as T;
      return (await res.json()) as T;
    }
    const body = await res.text().catch(() => res.statusText);
    throw new CastBrickApiError(res.status, body);
  }
}

export class CastBrickApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(`CastBrick API error ${status}: ${message}`);
    this.name = "CastBrickApiError";
  }
}
