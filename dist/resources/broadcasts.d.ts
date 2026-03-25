import type { CastBrickClient } from "../client.js";
import type { Broadcast, CreateBroadcastRequest, PagedResult, UpdateBroadcastRequest } from "../types.js";
export declare class BroadcastsResource {
    private readonly client;
    constructor(client: CastBrickClient);
    /** List broadcasts */
    list(page?: number, pageSize?: number): Promise<PagedResult<Broadcast>>;
    /** Get a broadcast by ID */
    get(id: string): Promise<Broadcast>;
    /** Create a new broadcast */
    create(data: CreateBroadcastRequest): Promise<string>;
    /** Update an existing broadcast */
    update(id: string, data: UpdateBroadcastRequest): Promise<string>;
    /** Send a broadcast immediately (or schedule it if scheduledAt is set) */
    send(id: string): Promise<void>;
    /** Cancel a scheduled or queued broadcast */
    cancel(id: string): Promise<void>;
    /** Duplicate an existing broadcast */
    duplicate(id: string): Promise<string>;
    /** Delete a broadcast */
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=broadcasts.d.ts.map