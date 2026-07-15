import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  children: ReactNode;
}

const VARIANT_STYLES: Record<string, React.CSSProperties> = {
  primary: {
    background: "var(--color-primary)",
    color: "white",
    border: "none",
  },
  secondary: {
    background: "var(--color-surface)",
    color: "var(--color-text-primary)",
    border: "1px solid var(--color-border)",
  },
  danger: {
    background: "transparent",
    color: "var(--color-danger)",
    border: "1px solid var(--color-danger)",
  },
};

export function Button({ variant = "primary", style, children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      style={{
        ...VARIANT_STYLES[variant],
        padding: "var(--space-2) var(--space-4)",
        borderRadius: "var(--radius-sm)",
        fontWeight: 500,
        cursor: props.disabled ? "not-allowed" : "pointer",
        opacity: props.disabled ? 0.6 : 1,
        transition: "opacity 0.15s, background 0.15s",
        ...style,
      }}
    >
      {children}
    </button>
  );
}