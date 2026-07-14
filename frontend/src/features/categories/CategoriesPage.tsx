import { useState } from "react";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "./hooks";
import { CategoryForm } from "./CategoryForm";
import type { Category } from "./types";

export function CategoriesPage() {
  const { data: categories, isLoading, error } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  if (isLoading) return <p>Carregando categorias...</p>;
  if (error) return <p>Erro ao buscar categorias: {String(error)}</p>;

  function handleCreate(data: {
    name: string;
    type: Category["type"];
    color: string;
    icon: string | null;
  }) {
    createMutation.mutate(data, {
      onSuccess: () => setIsCreating(false),
    });
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
    <div style={{ padding: "2rem", maxWidth: "600px" }}>
      <h1>Categorias</h1>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {categories?.map((category) => (
          <li
            key={category.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.5rem 0",
              borderBottom: "1px solid #eee",
            }}
          >
            {editingCategory?.id === category.id ? (
              <div style={{ flex: 1 }}>
                <CategoryForm
                  initialData={editingCategory}
                  onSubmit={handleUpdate}
                  onCancel={() => setEditingCategory(null)}
                  isSubmitting={updateMutation.isPending}
                />
              </div>
            ) : (
              <>
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: category.color,
                      display: "inline-block",
                    }}
                  />
                  {category.name} — {category.type}
                </span>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={() => setEditingCategory(category)}>Editar</button>
                  <button onClick={() => handleDelete(category.id)}>Excluir</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      {isCreating ? (
        <div style={{ marginTop: "1rem" }}>
          <h3>Nova categoria</h3>
          <CategoryForm
            onSubmit={handleCreate}
            onCancel={() => setIsCreating(false)}
            isSubmitting={createMutation.isPending}
          />
        </div>
      ) : (
        <button onClick={() => setIsCreating(true)} style={{ marginTop: "1rem" }}>
          + Nova categoria
        </button>
      )}
    </div>
  );
}