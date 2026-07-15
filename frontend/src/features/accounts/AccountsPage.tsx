import { useState } from "react";
import { useAccounts, useCreateAccount, useDeleteAccount, useUpdateAccount } from "./hooks";
import { AccountForm } from "./AccountForm";
import { Button, Card } from "../../components/ui";
import type { Account } from "./types";

const ACCOUNT_TYPE_LABELS: Record<Account["type"], string> = {
  checking: "Conta Corrente",
  savings: "Poupança",
  credit_card: "Cartão de Crédito",
  cash: "Dinheiro",
};

export function AccountsPage() {
  const { data: accounts, isLoading, error } = useAccounts();
  const createMutation = useCreateAccount();
  const updateMutation = useUpdateAccount();
  const deleteMutation = useDeleteAccount();

  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  function handleCreate(data: { name: string; type: Account["type"]; initial_balance: number }) {
    createMutation.mutate(data, { onSuccess: () => setIsCreating(false) });
  }

  function handleUpdate(data: { name: string; type: Account["type"]; initial_balance: number }) {
    if (!editingAccount) return;
    updateMutation.mutate(
      { id: editingAccount.id, payload: data },
      { onSuccess: () => setEditingAccount(null) }
    );
  }

  function handleDelete(id: string) {
    if (confirm("Tem certeza que deseja excluir essa conta?")) {
      deleteMutation.mutate(id);
    }
  }

  return (
    <div style={{ maxWidth: "700px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "var(--space-5)",
        }}
      >
        <h1 style={{ fontSize: "var(--font-size-2xl)" }}>Contas</h1>
        {!isCreating && <Button onClick={() => setIsCreating(true)}>+ Nova conta</Button>}
      </div>

      {isCreating && (
        <Card style={{ marginBottom: "var(--space-5)" }}>
          <h3 style={{ marginBottom: "var(--space-4)" }}>Nova conta</h3>
          <AccountForm
            onSubmit={handleCreate}
            onCancel={() => setIsCreating(false)}
            isSubmitting={createMutation.isPending}
          />
        </Card>
      )}

      {isLoading && <p style={{ color: "var(--color-text-secondary)" }}>Carregando contas...</p>}
      {error && <p style={{ color: "var(--color-danger)" }}>Erro ao buscar contas.</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        {accounts?.map((account) =>
          editingAccount?.id === account.id ? (
            <Card key={account.id}>
              <h3 style={{ marginBottom: "var(--space-4)" }}>Editar conta</h3>
              <AccountForm
                initialData={editingAccount}
                onSubmit={handleUpdate}
                onCancel={() => setEditingAccount(null)}
                isSubmitting={updateMutation.isPending}
              />
            </Card>
          ) : (
            <Card
              key={account.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "var(--space-4)",
              }}
            >
              <div>
                <p style={{ fontWeight: 600, marginBottom: "2px" }}>{account.name}</p>
                <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
                  {ACCOUNT_TYPE_LABELS[account.type]} · R$ {account.initial_balance.toFixed(2)}
                </p>
              </div>
              <div style={{ display: "flex", gap: "var(--space-2)" }}>
                <Button variant="secondary" onClick={() => setEditingAccount(account)}>
                  Editar
                </Button>
                <Button variant="danger" onClick={() => handleDelete(account.id)}>
                  Excluir
                </Button>
              </div>
            </Card>
          )
        )}
      </div>
    </div>
  );
}