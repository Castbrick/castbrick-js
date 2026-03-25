export class CastBrickClient {
    baseUrl;
    headers;
    constructor(options) {
        if (!options.apiKey)
            throw new Error("CastBrick: apiKey is required");
        this.baseUrl = (options.baseUrl ?? "https://api.castbrick.com").replace(/\/$/, "");
        this.headers = {
            Authorization: `Bearer ${options.apiKey}`,
            "Content-Type": "application/json",
        };
    }
    async get(path, params) {
        const url = new URL(this.baseUrl + path);
        if (params) {
            for (const [k, v] of Object.entries(params)) {
                if (v !== undefined && v !== null)
                    url.searchParams.set(k, String(v));
            }
        }
        const res = await fetch(url.toString(), { headers: this.headers });
        return this.handleResponse(res);
    }
    async post(path, body) {
        const res = await fetch(this.baseUrl + path, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(body),
        });
        return this.handleResponse(res);
    }
    async put(path, body) {
        const res = await fetch(this.baseUrl + path, {
            method: "PUT",
            headers: this.headers,
            body: JSON.stringify(body),
        });
        return this.handleResponse(res);
    }
    async delete(path) {
        const res = await fetch(this.baseUrl + path, {
            method: "DELETE",
            headers: this.headers,
        });
        if (!res.ok && res.status !== 204)
            await this.handleResponse(res);
    }
    async handleResponse(res) {
        if (res.ok) {
            if (res.status === 204)
                return undefined;
            return (await res.json());
        }
        const body = await res.text().catch(() => res.statusText);
        throw new CastBrickApiError(res.status, body);
    }
}
export class CastBrickApiError extends Error {
    status;
    constructor(status, message) {
        super(`CastBrick API error ${status}: ${message}`);
        this.status = status;
        this.name = "CastBrickApiError";
    }
}
//# sourceMappingURL=client.js.map