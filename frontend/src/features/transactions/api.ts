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
}

export async function fetchTransactions(
  params: FetchTransactionsParams = {}
): Promise<Transaction[]> {
  const { data } = await apiClient.get<Transaction[]>("/transactions/", {
    params: {
      skip: params.skip ?? 0,
      limit: params.limit ?? 20,
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