import type { ComponentPropsWithoutRef } from "react";

type TPaperProps = ComponentPropsWithoutRef<"div">;

export default function Paper({ className = "", ...props }: TPaperProps) {
  return (
    <div
      className={["bg-surface", "text-text", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
