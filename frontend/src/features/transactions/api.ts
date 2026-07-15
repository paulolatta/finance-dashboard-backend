import { apiClient } from "../../lib/api-client";
import type { Transaction, TransactionType } from "./types";

export interface TransactionPayload {
  description: string;
  amount: number;
  date: string;
  type: TransactionType;
  account_id: string;
  category_id: string;
  tags?: string[];
}

export interface FetchTransactionsParams {
  skip?: number;
  limit?: number;
  start_date?: string;
  end_date?: string;
  account_id?: string | null;
  category_id?: string | null;
}

export async function fetchTransactions(
  params: FetchTransactionsParams = {}
): Promise<Transaction[]> {
  const { data } = await apiClient.get<Transaction[]>("/transactions/", {
    params: {
      skip: params.skip ?? 0,
      limit: params.limit ?? 20,
      start_date: params.start_date,
      end_date: params.end_date,
      account_id: params.account_id ?? undefined,
      category_id: params.category_id ?? undefined,
    },
  });
  return data;
}

export async function createTransaction(payload: TransactionPayload): Promise<Transaction> {
  const { data } = await apiClient.post<Transaction>("/transactions/", payload);
  return data;
}

export async function deleteTransaction(id: string): Promise<void> {
  await apiClient.delete(`/transactions/${id}`);
}