import type { SelectHTMLAttributes, ReactNode } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  children: ReactNode;
}

export function Select({ label, style, children, ...props }: SelectProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
      {label && (
        <label style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
          {label}
        </label>
      )}
      <select
        {...props}
        style={{
          padding: "var(--space-2) var(--space-3)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-sm)",
          outline: "none",
          background: "var(--color-surface)",
          ...style,
        }}
      >
        {children}
      </select>
    </div>
  );
}