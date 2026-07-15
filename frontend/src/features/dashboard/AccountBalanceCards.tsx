import { useAccountBalances } from "./hooks";
import { Card } from "../../components/ui";

export function AccountBalanceCards() {
  const { data, isLoading } = useAccountBalances();

  if (isLoading) return <p style={{ color: "var(--color-text-secondary)" }}>Carregando saldos...</p>;
  if (!data || data.length === 0) return <p style={{ color: "var(--color-text-secondary)" }}>Nenhuma conta cadastrada.</p>;

  return (
    <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap" }}>
      {data.map((account) => (
        <Card key={account.account_id} style={{ minWidth: "200px", flex: "1" }}>
          <p
            style={{
              fontSize: "var(--font-size-sm)",
              color: "var(--color-text-secondary)",
              marginBottom: "var(--space-1)",
            }}
          >
            {account.account_name}
          </p>
          <p
            style={{
              fontSize: "var(--font-size-xl)",
              fontWeight: 700,
              color:
                account.current_balance >= 0 ? "var(--color-success)" : "var(--color-danger)",
            }}
          >
            R$ {account.current_balance.toFixed(2)}
          </p>
        </Card>
      ))}
    </div>
  );
}