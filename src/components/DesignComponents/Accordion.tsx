import type { ReactNode } from "react";

type TAccordionProps = { children: ReactNode; className?: string };

export default function Accordion({ children, className = "" }: TAccordionProps) {
  return <div className={`space-y-0.5 ${className}`}>{children}</div>;
}
