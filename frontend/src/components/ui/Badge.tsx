interface BadgeProps {
  children: React.ReactNode;
  color?: string;
}

export function Badge({ children, color = "var(--color-text-secondary)" }: BadgeProps) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: "999px",
        fontSize: "var(--font-size-sm)",
        background: `${color}20`, // 20 = ~12% opacidade em hex
        color,
        fontWeight: 500,
      }}
    >
      {children}
    </span>
  );
}