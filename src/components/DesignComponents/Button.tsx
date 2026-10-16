import type { ComponentPropsWithoutRef } from "react";

type TButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: "primary" | "ghost" | "subtle";
};

const variantClasses = {
  primary: "bg-brand-primary text-white hover:opacity-95",
  ghost: "text-text/70 hover:bg-brand-primary/10 hover:text-text",
  subtle: "text-text/50 hover:bg-brand-primary/10 hover:text-brand-primary",
};

export default function Button({ variant = "ghost", className = "", ...props }: TButtonProps) {
  return <button className={`rounded-lg font-medium transition-colors ${variantClasses[variant]} ${className}`} {...props} />;
}
