import { useState } from "react";
import { Button, Input, Select } from "../../components/ui";
import type { Account, AccountType } from "./types";

interface AccountFormProps {
  initialData?: Account;
  onSubmit: (data: { name: string; type: AccountType; initial_balance: number }) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

const ACCOUNT_TYPES: { value: AccountType; label: string }[] = [
  { value: "checking", label: "Conta Corrente" },
  { value: "savings", label: "Poupança" },
  { value: "credit_card", label: "Cartão de Crédito" },
  { value: "cash", label: "Dinheiro" },
];

export function AccountForm({ initialData, onSubmit, onCancel, isSubmitting }: AccountFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [type, setType] = useState<AccountType>(initialData?.type ?? "checking");
  const [initialBalance, setInitialBalance] = useState(
    initialData?.initial_balance?.toString() ?? "0"
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ name, type, initial_balance: parseFloat(initialBalance) || 0 });
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}
    >
      <Input label="Nome" value={name} onChange={(e) => setName(e.target.value)} required />

      <Select label="Tipo" value={type} onChange={(e) => setType(e.target.value as AccountType)}>
        {ACCOUNT_TYPES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </Select>

      <Input
        label="Saldo inicial"
        type="number"
        step="0.01"
        value={initialBalance}
        onChange={(e) => setInitialBalance(e.target.value)}
      />

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