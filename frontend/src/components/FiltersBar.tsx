import { useFiltersStore } from "../stores/filtersStore";
import { useAccounts } from "../features/accounts/hooks";
import { useCategories } from "../features/categories/hooks";
import { Button, Card, Input, Select } from "./ui";

export function FiltersBar() {
  const {
    startDate,
    endDate,
    accountId,
    categoryId,
    setStartDate,
    setEndDate,
    setAccountId,
    setCategoryId,
    resetFilters,
  } = useFiltersStore();

  const { data: accounts } = useAccounts();
  const { data: categories } = useCategories();

  return (
    <Card
      style={{
        display: "flex",
        gap: "var(--space-4)",
        alignItems: "flex-end",
        flexWrap: "wrap",
        marginBottom: "var(--space-5)",
        padding: "var(--space-4)",
      }}
    >
      <Input label="De" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      <Input label="Até" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

      <Select
        label="Conta"
        value={accountId ?? ""}
        onChange={(e) => setAccountId(e.target.value === "" ? null : e.target.value)}
      >
        <option value="">Todas</option>
        {accounts?.map((account) => (
          <option key={account.id} value={account.id}>
            {account.name}
          </option>
        ))}
      </Select>

      <Select
        label="Categoria"
        value={categoryId ?? ""}
        onChange={(e) => setCategoryId(e.target.value === "" ? null : e.target.value)}
      >
        <option value="">Todas</option>
        {categories?.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </Select>

      <Button variant="secondary" onClick={resetFilters}>
        Limpar filtros
      </Button>
    </Card>
  );
}