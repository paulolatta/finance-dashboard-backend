import { apiClient } from "../../lib/api-client";
import type { Account, AccountType } from "./types";

export interface AccountPayload {
  name: string;
  type: AccountType;
  initial_balance: number;
}

export async function fetchAccounts(): Promise<Account[]> {
  const { data } = await apiClient.get<Account[]>("/accounts/");
  return data;
}

export async function createAccount(payload: AccountPayload): Promise<Account> {
  const { data } = await apiClient.post<Account>("/accounts/", payload);
  return data;
}

export async function updateAccount(id: string, payload: Partial<AccountPayload>): Promise<Account> {
  const { data } = await apiClient.patch<Account>(`/accounts/${id}`, payload);
  return data;
}

export async function deleteAccount(id: string): Promise<void> {
  await apiClient.delete(`/accounts/${id}`);
}