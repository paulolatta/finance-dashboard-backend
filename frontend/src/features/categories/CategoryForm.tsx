import { useState } from "react";
import type { Category, CategoryType } from "./types";

interface CategoryFormProps {
  initialData?: Category;
  onSubmit: (data: {
    name: string;
    type: CategoryType;
    color: string;
    icon: string | null;
  }) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

const CATEGORY_TYPES: { value: CategoryType; label: string }[] = [
  { value: "income", label: "Receita" },
  { value: "expense", label: "Despesa" },
];

export function CategoryForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: CategoryFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [type, setType] = useState<CategoryType>(initialData?.type ?? "expense");
  const [color, setColor] = useState(initialData?.color ?? "#6B7280");
  const [icon, setIcon] = useState(initialData?.icon ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      name,
      type,
      color,
      icon: icon.trim() === "" ? null : icon,
    });
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div>
        <label>Nome</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ display: "block", width: "100%" }}
        />
      </div>

      <div>
        <label>Tipo</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as CategoryType)}
          style={{ display: "block", width: "100%" }}
        >
          {CATEGORY_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Cor</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          style={{ display: "block" }}
        />
      </div>

      <div>
        <label>Ícone (opcional)</label>
        <input
          type="text"
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          placeholder="ex: shopping-cart"
          style={{ display: "block", width: "100%" }}
        />
      </div>

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}