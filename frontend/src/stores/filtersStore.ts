import { create } from "zustand";

interface FiltersState {
  startDate: string; // formato ISO (yyyy-mm-dd)
  endDate: string;
  accountId: string | null; // null = todas as contas
  categoryId: string | null; // null = todas as categorias

  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  setAccountId: (id: string | null) => void;
  setCategoryId: (id: string | null) => void;
  resetFilters: () => void;
}

function getDefaultDateRange() {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  return {
    startDate: firstDayOfMonth.toISOString().slice(0, 10),
    endDate: now.toISOString().slice(0, 10),
  };
}

export const useFiltersStore = create<FiltersState>((set) => ({
  ...getDefaultDateRange(),
  accountId: null,
  categoryId: null,

  setStartDate: (date) => set({ startDate: date }),
  setEndDate: (date) => set({ endDate: date }),
  setAccountId: (id) => set({ accountId: id }),
  setCategoryId: (id) => set({ categoryId: id }),
  resetFilters: () => set({ ...getDefaultDateRange(), accountId: null, categoryId: null }),
}));