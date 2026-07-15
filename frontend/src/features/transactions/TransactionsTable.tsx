import { useEffect, useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useTransactions, useDeleteTransaction } from "./hooks";
import { useAccounts } from "../accounts/hooks";
import { useCategories } from "../categories/hooks";
import { useFiltersStore } from "../../stores/filtersStore";
import { Button, Card } from "../../components/ui";
import type { Transaction } from "./types";

const columnHelper = createColumnHelper<Transaction>();

export function TransactionsTable() {
  const [page, setPage] = useState(0);
  const limit = 10;

  const { startDate, endDate, accountId, categoryId } = useFiltersStore();

  useEffect(() => {
    setPage(0);
  }, [startDate, endDate, accountId, categoryId]);

  const { data: transactions, isLoading, isPlaceholderData } = useTransactions({
    skip: page * limit,
    limit,
    start_date: startDate ? new Date(startDate).toISOString() : undefined,
    end_date: endDate ? new Date(endDate).toISOString() : undefined,
    account_id: accountId,
    category_id: categoryId,
  });
  const { data: accounts } = useAccounts();
  const { data: categories } = useCategories();
  const deleteMutation = useDeleteTransaction();

  const accountMap = useMemo(
    () => new Map(accounts?.map((a) => [a.id, a.name]) ?? []),
    [accounts]
  );
  const categoryMap = useMemo(
    () => new Map(categories?.map((c) => [c.id, c.name]) ?? []),
    [categories]
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor("date", {
        header: "Data",
        cell: (info) => new Date(info.getValue()).toLocaleDateString("pt-BR"),
      }),
      columnHelper.accessor("description", {
        header: "Descrição",
      }),
      columnHelper.accessor("account_id", {
        header: "Conta",
        cell: (info) => accountMap.get(info.getValue()) ?? "—",
      }),
      columnHelper.accessor("category_id", {
        header: "Categoria",
        cell: (info) => categoryMap.get(info.getValue()) ?? "—",
      }),
      columnHelper.accessor("amount", {
        header: "Valor",
        cell: (info) => {
          const value = info.getValue();
          const type = info.row.original.type;
          const color = type === "income" ? "var(--color-success)" : "var(--color-danger)";
          const sign = type === "income" ? "+" : "-";
          return (
            <span style={{ color, fontWeight: 600 }}>
              {sign} R$ {value.toFixed(2)}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "actions",
        header: "",
        cell: (info) => (
          <Button
            variant="danger"
            onClick={() => {
              if (confirm("Excluir essa transação?")) {
                deleteMutation.mutate(info.row.original.id);
              }
            }}
            style={{ padding: "4px 10px", fontSize: "var(--font-size-sm)" }}
          >
            Excluir
          </Button>
        ),
      }),
    ],
    [accountMap, categoryMap, deleteMutation]
  );

  const table = useReactTable({
    data: transactions ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <p style={{ color: "var(--color-text-secondary)" }}>Carregando transações...</p>;

  return (
    <Card style={{ padding: 0, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} style={{ background: "var(--color-bg)" }}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  style={{
                    textAlign: "left",
                    padding: "var(--space-3) var(--space-4)",
                    fontSize: "var(--font-size-sm)",
                    color: "var(--color-text-secondary)",
                    fontWeight: 600,
                  }}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} style={{ borderTop: "1px solid var(--color-border)" }}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} style={{ padding: "var(--space-3) var(--space-4)" }}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{
          display: "flex",
          gap: "var(--space-3)",
          alignItems: "center",
          padding: "var(--space-3) var(--space-4)",
          borderTop: "1px solid var(--color-border)",
        }}
      >
        <Button
          variant="secondary"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
        >
          Anterior
        </Button>
        <span style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
          Página {page + 1}
        </span>
        <Button
          variant="secondary"
          onClick={() => setPage((p) => p + 1)}
          disabled={isPlaceholderData || (transactions?.length ?? 0) < limit}
        >
          Próxima
        </Button>
      </div>
    </Card>
  );
}