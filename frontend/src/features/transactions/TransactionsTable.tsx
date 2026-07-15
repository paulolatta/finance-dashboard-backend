import { useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useTransactions, useDeleteTransaction } from "./hooks";
import { useAccounts } from "../accounts/hooks";
import { useCategories } from "../categories/hooks";
import type { Transaction } from "./types";
import { useFiltersStore } from "../../stores/filtersStore";
import { useEffect } from "react";

const columnHelper = createColumnHelper<Transaction>();

export function TransactionsTable() {
  const [page, setPage] = useState(0);
  const limit = 10;

  const { startDate, endDate, accountId, categoryId } = useFiltersStore();

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

  useEffect(() => {
    setPage(0);
    }, [startDate, endDate, accountId, categoryId]);

  // Mapas de ID -> nome, pra não fazer O(n) find() a cada célula renderizada
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
          const color = type === "income" ? "green" : "red";
          const sign = type === "income" ? "+" : "-";
          return (
            <span style={{ color }}>
              {sign} R$ {value.toFixed(2)}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "actions",
        header: "Ações",
        cell: (info) => (
          <button
            onClick={() => {
              if (confirm("Excluir essa transação?")) {
                deleteMutation.mutate(info.row.original.id);
              }
            }}
          >
            Excluir
          </button>
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

  if (isLoading) return <p>Carregando transações...</p>;

  return (
    <div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  style={{ textAlign: "left", borderBottom: "2px solid #ddd", padding: "0.5rem" }}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} style={{ padding: "0.5rem", borderBottom: "1px solid #eee" }}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", alignItems: "center" }}>
        <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>
          Anterior
        </button>
        <span>Página {page + 1}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={isPlaceholderData || (transactions?.length ?? 0) < limit}
        >
          Próxima
        </button>
      </div>
    </div>
  );
}