import { useState } from "react";

import Dashboard from "../components/DashBoard/DashBoard";
import AppHeader from "../components/AppHeader/AppHeader";
import Sidebar from "../components/Sidebar/SideBar";
import Paper from "../components/DesignComponents/Paper";

export default function Layout() {
  const [currentView, setCurrentView] = useState<"home" | "analytics">("home");
  return (
    <Paper className="flex h-screen w-screen flex-col overflow-hidden motion-reduce:transition-none">
      <AppHeader />

      <div className="flex min-h-0 w-full flex-1 overflow-hidden">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />

        <Dashboard currentView={currentView} />
      </div>
    </Paper>
  );
}
