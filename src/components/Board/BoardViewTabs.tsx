import Button from "../DesignComponents/Button";

export type TBoardView = "board" | "list";
type TBoardViewTabsProps = {
  view: TBoardView;
  onChange: (view: TBoardView) => void;
};

export default function BoardViewTabs({ view, onChange }: TBoardViewTabsProps) {
  return (
    <div
      className="flex gap-1 border-b border-border px-5"
      role="tablist"
      aria-label="Board view"
    >
      {(["board", "list"] as const).map((option) => (
        <Button
          key={option}
          type="button"
          role="tab"
          aria-selected={view === option}
          variant="ghost"
          onClick={() => onChange(option)}
          className={`rounded-none border-b-2 px-3 py-2.5 text-sm ${view === option ? "border-brand-primary text-brand-primary" : "border-transparent text-muted"}`}
        >
          {option === "board" ? "Kanban board" : "List"}
        </Button>
      ))}
    </div>
  );
}
