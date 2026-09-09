import type { CastBrickClient } from "../client.js";
import type { BillingBalance, CreditPack, CreditLedgerEntry, InitiatePaymentRequest, InitiatePaymentResponse, PaymentInfo } from "../types.js";

export class BillingResource {
  constructor(private readonly client: CastBrickClient) {}

  /** Get the current billing credit balance and configuration */
  getBalance(): Promise<BillingBalance> {
    return this.client.get<BillingBalance>("/billing/balance");
  }

  /** List available credit packages */
  listPackages(): Promise<CreditPack[]> {
    return this.client.get<CreditPack[]>("/billing/packages");
  }

  /** Initiate a credit package purchase transaction */
  initiatePayment(data: InitiatePaymentRequest): Promise<InitiatePaymentResponse> {
    return this.client.post<InitiatePaymentResponse>("/billing/payments/initiate", data);
  }

  /** List payments for the authenticated workspace */
  listPayments(params: {
    cursor?: string;
    limit?: number;
    status?: string;
    from?: string;
    to?: string;
  } = {}): Promise<{ items: PaymentInfo[]; nextCursor?: string }> {
    return this.client.get<{ items: PaymentInfo[]; nextCursor?: string }>("/billing/payments", params as any);
  }

  /** List balance transaction history / ledger entries */
  listTransactions(cursor?: string): Promise<{ items: CreditLedgerEntry[]; nextCursor?: string }> {
    const params: Record<string, string> = {};
    if (cursor) params.cursor = cursor;
    return this.client.get<{ items: CreditLedgerEntry[]; nextCursor?: string }>("/billing/transactions", params);
  }
}
