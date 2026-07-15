import { useState } from "react";
import { useAccounts } from "../accounts/hooks";
import { useCategories } from "../categories/hooks";
import { Button, Input, Select } from "../../components/ui";
import type { TransactionType } from "./types";

interface TransactionFormProps {
  onSubmit: (data: {
    description: string;
    amount: number;
    date: string;
    type: TransactionType;
    account_id: string;
    category_id: string;
  }) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

const TRANSACTION_TYPES: { value: TransactionType; label: string }[] = [
  { value: "expense", label: "Despesa" },
  { value: "income", label: "Receita" },
];

export function TransactionForm({ onSubmit, onCancel, isSubmitting }: TransactionFormProps) {
  const { data: accounts } = useAccounts();
  const { data: categories } = useCategories();

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [type, setType] = useState<TransactionType>("expense");
  const [accountId, setAccountId] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const filteredCategories = categories?.filter((c) => c.type === type) ?? [];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!accountId || !categoryId) {
      alert("Selecione uma conta e uma categoria.");
      return;
    }

    onSubmit({
      description,
      amount: parseFloat(amount) || 0,
      date: new Date(date).toISOString(),
      type,
      account_id: accountId,
      category_id: categoryId,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}
    >
      <Input
        label="Descrição"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <Input
        label="Valor"
        type="number"
        step="0.01"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      <Input label="Data" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />

      <Select
        label="Tipo"
        value={type}
        onChange={(e) => {
          setType(e.target.value as TransactionType);
          setCategoryId("");
        }}
      >
        {TRANSACTION_TYPES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </Select>

      <Select label="Conta" value={accountId} onChange={(e) => setAccountId(e.target.value)} required>
        <option value="">Selecione...</option>
        {accounts?.map((account) => (
          <option key={account.id} value={account.id}>
            {account.name}
          </option>
        ))}
      </Select>

      <Select
        label="Categoria"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        required
      >
        <option value="">Selecione...</option>
        {filteredCategories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </Select>

      <div style={{ display: "flex", gap: "var(--space-2)" }}>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar"}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}