import type { CastBrickOptions } from "./types.js";
export declare class CastBrickClient {
    readonly baseUrl: string;
    private readonly headers;
    constructor(options: CastBrickOptions);
    get<T>(path: string, params?: Record<string, string | number | boolean>): Promise<T>;
    post<T>(path: string, body: unknown): Promise<T>;
    put<T>(path: string, body: unknown): Promise<T>;
    delete(path: string): Promise<void>;
    private handleResponse;
}
export declare class CastBrickApiError extends Error {
    readonly status: number;
    constructor(status: number, message: string);
}
//# sourceMappingURL=client.d.ts.map