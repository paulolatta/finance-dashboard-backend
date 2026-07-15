import { FiltersBar } from "../../components/FiltersBar";
import { AccountBalanceCards } from "./AccountBalanceCards";
import { CategoryPieChart } from "./CategoryPieChart";
import { MonthlyEvolutionChart } from "./MonthlyEvolutionChart";

export function DashboardPage() {
  return (
    <div>
      <h1 style={{ fontSize: "var(--font-size-2xl)", marginBottom: "var(--space-5)" }}>
        Dashboard
      </h1>

      <FiltersBar />

      <div style={{ marginBottom: "var(--space-6)" }}>
        <AccountBalanceCards />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--space-5)",
        }}
      >
        <CategoryPieChart />
        <MonthlyEvolutionChart />
      </div>
    </div>
  );
}