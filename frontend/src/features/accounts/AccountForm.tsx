import { useState } from "react";
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
    onSubmit({
      name,
      type,
      initial_balance: parseFloat(initialBalance) || 0,
    });
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div>
        <label>Nome</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ display: "block", width: "100%" }}
        />
      </div>

      <div>
        <label>Tipo</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as AccountType)}
          style={{ display: "block", width: "100%" }}
        >
          {ACCOUNT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Saldo inicial</label>
        <input
          type="number"
          step="0.01"
          value={initialBalance}
          onChange={(e) => setInitialBalance(e.target.value)}
          style={{ display: "block", width: "100%" }}
        />
      </div>

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}