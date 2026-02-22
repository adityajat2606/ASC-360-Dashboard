import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Wallet,
  CreditCard,
  FileText,
  ClipboardList,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  Headphones,
  Bell,
  UserCircle,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
];

const operatorItems = [
  { label: "Assign Covers", path: "/assign-covers" },
  { label: "Wallet", path: "/wallet" },
  { label: "Payments", path: "/payments" },
  { label: "Policy Issued", path: "/policy-issued" },
];

const issuanceItems = [
  { label: "Single Issuance", path: "/issuance/single" },
  { label: "Bulk Issuance", path: "/issuance/bulk" },
  { label: "Quote Links", path: "/issuance/quote-links" },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [operatorOpen, setOperatorOpen] = useState(true);
  const [issuanceOpen, setIssuanceOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 text-sm rounded-md transition-colors ${
      isActive
        ? "bg-primary text-primary-foreground font-medium"
        : "text-sidebar-foreground hover:bg-sidebar-hover"
    }`;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-card border-r border-border flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 py-4 border-b border-border">
          <img src="/favicon.png" alt="ASC 360" className="w-8 h-8 object-contain" />
          <span className="font-semibold text-sm text-foreground">ASC 360</span>
          <ArrowLeft className="ml-auto w-4 h-4 text-muted-foreground cursor-pointer" />
        </div>

        <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} end className={linkClass}>
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}

          {/* Operator Details */}
          <button
            onClick={() => setOperatorOpen(!operatorOpen)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm w-full text-sidebar-foreground hover:bg-sidebar-hover rounded-md"
          >
            <Users className="w-4 h-4" />
            Operator Details
            {operatorOpen ? (
              <ChevronDown className="ml-auto w-4 h-4" />
            ) : (
              <ChevronRight className="ml-auto w-4 h-4" />
            )}
          </button>
          {operatorOpen &&
            operatorItems.map((item) => (
              <NavLink key={item.path} to={item.path} className={linkClass}>
                <span className="ml-7">{item.label}</span>
              </NavLink>
            ))}

          {/* Issuance */}
          <button
            onClick={() => setIssuanceOpen(!issuanceOpen)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm w-full text-sidebar-foreground hover:bg-sidebar-hover rounded-md"
          >
            <ClipboardList className="w-4 h-4" />
            Issuance
            {issuanceOpen ? (
              <ChevronDown className="ml-auto w-4 h-4" />
            ) : (
              <ChevronRight className="ml-auto w-4 h-4" />
            )}
          </button>
          {issuanceOpen &&
            issuanceItems.map((item) => (
              <NavLink key={item.path} to={item.path} className={linkClass}>
                <span className="ml-7">{item.label}</span>
              </NavLink>
            ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-card border-b border-border flex items-center justify-end px-6 gap-4">
          <Headphones className="w-5 h-5 text-muted-foreground cursor-pointer" />
          <div className="relative">
            <Bell className="w-5 h-5 text-muted-foreground cursor-pointer" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-card" />
          </div>
          <button
            onClick={() => navigate("/operator-profile")}
            className="p-1 hover:bg-muted rounded-md transition-colors"
            aria-label="Operator Profile"
          >
            <UserCircle className="w-6 h-6 text-muted-foreground cursor-pointer" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
