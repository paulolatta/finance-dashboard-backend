import { useState } from "react";
import { TransactionsTable } from "./TransactionsTable";
import { TransactionForm } from "./TransactionForm";
import { ImportCsvModal } from "./ImportCsvModal";
import { useCreateTransaction } from "./hooks";
import { FiltersBar } from "../../components/FiltersBar";
import { Button, Card } from "../../components/ui";

export function TransactionsPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const createMutation = useCreateTransaction();

  function handleCreate(data: Parameters<typeof createMutation.mutate>[0]) {
    createMutation.mutate(data, { onSuccess: () => setIsCreating(false) });
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "var(--space-5)",
        }}
      >
        <h1 style={{ fontSize: "var(--font-size-2xl)" }}>Transações</h1>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <Button variant="secondary" onClick={() => setIsImporting(true)}>
            Importar CSV
          </Button>
          {!isCreating && <Button onClick={() => setIsCreating(true)}>+ Nova transação</Button>}
        </div>
      </div>

      <FiltersBar />

      {isCreating && (
        <Card style={{ marginBottom: "var(--space-5)", maxWidth: "500px" }}>
          <h3 style={{ marginBottom: "var(--space-4)" }}>Nova transação</h3>
          <TransactionForm
            onSubmit={handleCreate}
            onCancel={() => setIsCreating(false)}
            isSubmitting={createMutation.isPending}
          />
        </Card>
      )}

      {isImporting && <ImportCsvModal onClose={() => setIsImporting(false)} />}

      <TransactionsTable />
    </div>
  );
}