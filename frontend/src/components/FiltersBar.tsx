import { useFiltersStore } from "../stores/filtersStore";
import { useAccounts } from "../features/accounts/hooks";
import { useCategories } from "../features/categories/hooks";

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
    <div
      style={{
        display: "flex",
        gap: "1rem",
        alignItems: "flex-end",
        padding: "1rem",
        background: "#f9fafb",
        borderRadius: "8px",
        marginBottom: "1.5rem",
        flexWrap: "wrap",
      }}
    >
      <div>
        <label style={{ display: "block", fontSize: "0.85rem" }}>De</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      </div>

      <div>
        <label style={{ display: "block", fontSize: "0.85rem" }}>Até</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>

      <div>
        <label style={{ display: "block", fontSize: "0.85rem" }}>Conta</label>
        <select
          value={accountId ?? ""}
          onChange={(e) => setAccountId(e.target.value === "" ? null : e.target.value)}
        >
          <option value="">Todas</option>
          {accounts?.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label style={{ display: "block", fontSize: "0.85rem" }}>Categoria</label>
        <select
          value={categoryId ?? ""}
          onChange={(e) => setCategoryId(e.target.value === "" ? null : e.target.value)}
        >
          <option value="">Todas</option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <button onClick={resetFilters}>Limpar filtros</button>
    </div>
  );
}