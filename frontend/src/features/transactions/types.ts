export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: TransactionType;
  account_id: string;
  category_id: string;
  tags: string[];
  created_at: string;
}