import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

interface LayoutProps {
  children: ReactNode;
}

const NAV_ITEMS = [
  { to: "/", label: "Dashboard" },
  { to: "/transactions", label: "Transações" },
  { to: "/accounts", label: "Contas" },
  { to: "/categories", label: "Categorias" },
];

export function Layout({ children }: LayoutProps) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <nav
        style={{
          width: "220px",
          borderRight: "1px solid var(--color-border)",
          padding: "var(--space-5) var(--space-4)",
          background: "var(--color-surface)",
        }}
      >
        <h2
          style={{
            fontSize: "var(--font-size-lg)",
            marginBottom: "var(--space-6)",
            color: "var(--color-primary)",
          }}
        >
          Finance Dashboard
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              style={{
                textDecoration: "none",
                color: "var(--color-text-secondary)",
                padding: "var(--space-2) var(--space-3)",
                borderRadius: "var(--radius-sm)",
                fontSize: "var(--font-size-sm)",
                fontWeight: 500,
              }}
              activeProps={{
                style: {
                  color: "var(--color-primary)",
                  background: "#EEF2FF",
                },
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <main style={{ flex: 1, padding: "var(--space-6)" }}>{children}</main>
    </div>
  );
}