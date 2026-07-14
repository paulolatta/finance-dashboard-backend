import { useState } from "react";
import { useAccounts, useCreateAccount, useDeleteAccount, useUpdateAccount } from "./hooks";
import { AccountForm } from "./AccountForm";
import type { Account } from "./types";

export function AccountsPage() {
  const { data: accounts, isLoading, error } = useAccounts();
  const createMutation = useCreateAccount();
  const updateMutation = useUpdateAccount();
  const deleteMutation = useDeleteAccount();

  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  if (isLoading) return <p>Carregando contas...</p>;
  if (error) return <p>Erro ao buscar contas: {String(error)}</p>;

  function handleCreate(data: { name: string; type: Account["type"]; initial_balance: number }) {
    createMutation.mutate(data, {
      onSuccess: () => setIsCreating(false),
    });
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
    <div style={{ padding: "2rem", maxWidth: "600px" }}>
      <h1>Contas</h1>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {accounts?.map((account) => (
          <li
            key={account.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.5rem 0",
              borderBottom: "1px solid #eee",
            }}
          >
            {editingAccount?.id === account.id ? (
              <div style={{ flex: 1 }}>
                <AccountForm
                  initialData={editingAccount}
                  onSubmit={handleUpdate}
                  onCancel={() => setEditingAccount(null)}
                  isSubmitting={updateMutation.isPending}
                />
              </div>
            ) : (
              <>
                <span>
                  {account.name} — {account.type} — R$ {account.initial_balance.toFixed(2)}
                </span>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={() => setEditingAccount(account)}>Editar</button>
                  <button onClick={() => handleDelete(account.id)}>Excluir</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      {isCreating ? (
        <div style={{ marginTop: "1rem" }}>
          <h3>Nova conta</h3>
          <AccountForm
            onSubmit={handleCreate}
            onCancel={() => setIsCreating(false)}
            isSubmitting={createMutation.isPending}
          />
        </div>
      ) : (
        <button onClick={() => setIsCreating(true)} style={{ marginTop: "1rem" }}>
          + Nova conta
        </button>
      )}
    </div>
  );
}