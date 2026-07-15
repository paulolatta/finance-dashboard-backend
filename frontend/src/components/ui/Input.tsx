import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, style, ...props }: InputProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
      {label && (
        <label style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
          {label}
        </label>
      )}
      <input
        {...props}
        style={{
          padding: "var(--space-2) var(--space-3)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-sm)",
          outline: "none",
          ...style,
        }}
      />
    </div>
  );
}