import { apiClient } from "../../lib/api-client";
import type { Category, CategoryType } from "./types";

export interface CategoryPayload {
  name: string;
  type: CategoryType;
  color: string;
  icon?: string | null;
}

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await apiClient.get<Category[]>("/categories/");
  return data;
}

export async function createCategory(payload: CategoryPayload): Promise<Category> {
  const { data } = await apiClient.post<Category>("/categories/", payload);
  return data;
}

export async function updateCategory(
  id: string,
  payload: Partial<CategoryPayload>
): Promise<Category> {
  const { data } = await apiClient.patch<Category>(`/categories/${id}`, payload);
  return data;
}

export async function deleteCategory(id: string): Promise<void> {
  await apiClient.delete(`/categories/${id}`);
}