import { useState } from "react";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "./hooks";
import { CategoryForm } from "./CategoryForm";
import { Button, Card } from "../../components/ui";
import type { Category } from "./types";

const CATEGORY_TYPE_LABELS: Record<Category["type"], string> = {
  income: "Receita",
  expense: "Despesa",
};

export function CategoriesPage() {
  const { data: categories, isLoading, error } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  function handleCreate(data: {
    name: string;
    type: Category["type"];
    color: string;
    icon: string | null;
  }) {
    createMutation.mutate(data, { onSuccess: () => setIsCreating(false) });
  }

  function handleUpdate(data: {
    name: string;
    type: Category["type"];
    color: string;
    icon: string | null;
  }) {
    if (!editingCategory) return;
    updateMutation.mutate(
      { id: editingCategory.id, payload: data },
      { onSuccess: () => setEditingCategory(null) }
    );
  }

  function handleDelete(id: string) {
    if (confirm("Tem certeza que deseja excluir essa categoria?")) {
      deleteMutation.mutate(id);
    }
  }

  return (
    <div style={{ maxWidth: "700px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "var(--space-5)",
        }}
      >
        <h1 style={{ fontSize: "var(--font-size-2xl)" }}>Categorias</h1>
        {!isCreating && <Button onClick={() => setIsCreating(true)}>+ Nova categoria</Button>}
      </div>

      {isCreating && (
        <Card style={{ marginBottom: "var(--space-5)" }}>
          <h3 style={{ marginBottom: "var(--space-4)" }}>Nova categoria</h3>
          <CategoryForm
            onSubmit={handleCreate}
            onCancel={() => setIsCreating(false)}
            isSubmitting={createMutation.isPending}
          />
        </Card>
      )}

      {isLoading && <p style={{ color: "var(--color-text-secondary)" }}>Carregando categorias...</p>}
      {error && <p style={{ color: "var(--color-danger)" }}>Erro ao buscar categorias.</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        {categories?.map((category) =>
          editingCategory?.id === category.id ? (
            <Card key={category.id}>
              <h3 style={{ marginBottom: "var(--space-4)" }}>Editar categoria</h3>
              <CategoryForm
                initialData={editingCategory}
                onSubmit={handleUpdate}
                onCancel={() => setEditingCategory(null)}
                isSubmitting={updateMutation.isPending}
              />
            </Card>
          ) : (
            <Card
              key={category.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "var(--space-4)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                <span
                  style={{
                    width: "14px",
                    height: "14px",
                    borderRadius: "50%",
                    backgroundColor: category.color,
                    display: "inline-block",
                  }}
                />
                <div>
                  <p style={{ fontWeight: 600, marginBottom: "2px" }}>{category.name}</p>
                  <p
                    style={{
                      fontSize: "var(--font-size-sm)",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    {CATEGORY_TYPE_LABELS[category.type]}
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "var(--space-2)" }}>
                <Button variant="secondary" onClick={() => setEditingCategory(category)}>
                  Editar
                </Button>
                <Button variant="danger" onClick={() => handleDelete(category.id)}>
                  Excluir
                </Button>
              </div>
            </Card>
          )
        )}
      </div>
    </div>
  );
}