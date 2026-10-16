import { forwardRef, type ComponentPropsWithoutRef } from "react";

type TButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: "primary" | "ghost" | "subtle";
};

const variantClasses = {
  primary: "bg-brand-primary text-white hover:opacity-95",
  ghost: "text-text/70 hover:bg-brand-primary/10 hover:text-text",
  subtle: "text-text/50 hover:bg-brand-primary/10 hover:text-brand-primary",
};

const Button = forwardRef<HTMLButtonElement, TButtonProps>(({ variant = "ghost", className = "", ...props }, ref) => (
  <button ref={ref} className={`rounded-lg font-medium transition-colors ${variantClasses[variant]} ${className}`} {...props} />
));

Button.displayName = "Button";

export default Button;
