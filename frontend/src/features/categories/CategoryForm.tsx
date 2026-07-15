import { useState } from "react";
import { Button, Input, Select } from "../../components/ui";
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
    onSubmit({ name, type, color, icon: icon.trim() === "" ? null : icon });
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}
    >
      <Input label="Nome" value={name} onChange={(e) => setName(e.target.value)} required />

      <Select label="Tipo" value={type} onChange={(e) => setType(e.target.value as CategoryType)}>
        {CATEGORY_TYPES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </Select>

      <Input
        label="Cor"
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        style={{ padding: "2px", height: "38px" }}
      />

      <Input
        label="Ícone (opcional)"
        value={icon}
        onChange={(e) => setIcon(e.target.value)}
        placeholder="ex: shopping-cart"
      />

      <div style={{ display: "flex", gap: "var(--space-2)" }}>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar"}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}