import { useEffect, useRef, useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import { useAppDispatch } from "../../store/hooks";
import { selectList, switchUser } from "../../store/reducer/sessionReducer";
import Button from "../DesignComponents/Button";
import Toggle from "../DesignComponents/Toggle";
import useAccessControl from "../../hooks/useAccessControl";

export default function AppHeader() {
  const { theme, toggleTheme } = useTheme();
  const { users, currentUser, currentUserId, getFirstAccessibleBoard } =
    useAccessControl();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return undefined;
    const close = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const chooseUser = (userId: string) => {
    const firstBoardId = getFirstAccessibleBoard(userId);
    dispatch(switchUser(userId));
    dispatch(selectList(firstBoardId));
    setOpen(false);
  };

  return (
    <header className="flex h-14 w-full shrink-0 items-center justify-between border-b border-border bg-surface px-5">
      <div className="text-base font-semibold tracking-tight">FlowBoard</div>
      <div ref={menuRef} className="relative">
        <Button
          type="button"
          variant="ghost"
          aria-label="Open account menu"
          aria-expanded={open}
          onClick={() => setOpen((isOpen) => !isOpen)}
          className="rounded-full p-0.5"
        >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary/15 text-[11px] font-semibold text-brand-primary">
            {currentUser?.name.slice(0, 2).toUpperCase() ?? "??"}
          </span>
        </Button>
        {open && (
          <div className="absolute right-0 top-full z-30 mt-2 w-60 rounded-panel border border-border bg-surface p-1.5 shadow-panel">
            <div className="border-b border-brand-primary/10 px-3 py-2">
              <p className="text-sm font-semibold">
                {currentUser?.name ?? "User"}
              </p>
              <p className="text-xs text-text/50">
                {currentUser?.role ?? "member"}
              </p>
            </div>
            <div className="border-b border-brand-primary/10 py-2">
              <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-text/45">
                Users
              </p>
              {users.map((user) => (
                <Button
                  key={user.id}
                  type="button"
                  variant="ghost"
                  onClick={() => chooseUser(user.id)}
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm"
                >
                  <span>{user.name}</span>
                  <span className="text-xs text-text/45">
                    {user.id === currentUserId ? "Current" : user.role}
                  </span>
                </Button>
              ))}
            </div>
            <div className="p-3">
              <p className="pb-2 text-[11px] font-semibold uppercase tracking-wider text-text/45">
                Settings
              </p>
              <Toggle
                label="Dark theme"
                checked={theme === "dark"}
                onChange={toggleTheme}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
