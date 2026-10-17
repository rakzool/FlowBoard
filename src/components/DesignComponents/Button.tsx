import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { BUTTON_VARIANT_CLASSES } from "../../constants/design.constants";

type TButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: "primary" | "ghost" | "subtle";
};

const Button = forwardRef<HTMLButtonElement, TButtonProps>(
  ({ variant = "ghost", className = "", ...props }, ref) => (
    <button
      ref={ref}
      className={`rounded-control font-medium transition-colors ${BUTTON_VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  ),
);

Button.displayName = "Button";

export default Button;
