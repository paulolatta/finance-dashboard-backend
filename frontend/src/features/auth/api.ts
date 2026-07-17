import { apiClient } from "../../lib/api-client";
import type { AuthPayload, TokenResponse } from "./types";

export async function registerUser(payload: AuthPayload): Promise<TokenResponse> {
  const { data } = await apiClient.post<TokenResponse>("/auth/register", payload);
  return data;
}

export async function loginUser(payload: AuthPayload): Promise<TokenResponse> {
  const { data } = await apiClient.post<TokenResponse>("/auth/login", payload);
  return data;
}