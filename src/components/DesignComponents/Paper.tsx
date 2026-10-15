import type { ComponentPropsWithoutRef } from "react";

type PaperProps = ComponentPropsWithoutRef<"div">;

export default function Paper({ className = "", ...props }: PaperProps) {
  return (
    <div
      className={["bg-surface", "text-text", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
