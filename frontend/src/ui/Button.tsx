import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant:
    | "manage-mods"
    | "delete"
    | "delete-confirm"
    | "delete-cancel"
    | "primary-full";
  children: ReactNode;
  loading?: boolean;
}

export default function Button({
  variant,
  children,
  loading = false,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  const baseClasses = variant;
  const isDisabled = disabled || loading;

  return (
    <button
      className={`${baseClasses} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
