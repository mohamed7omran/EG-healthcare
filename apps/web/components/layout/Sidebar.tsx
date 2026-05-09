"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import {
  Home,
  Search,
  Calendar,
  MessageSquare,
  Users,
  Brain,
  Settings,
  Stethoscope,
  FileText,
} from "lucide-react";

const patientNavItems = [
  { icon: Home, label: "Dashboard", path: "/dashboard" },
  { icon: Search, label: "Find Doctors", path: "/Doctors" },
  { icon: Calendar, label: "My Appointments", path: "/appointments" },
  { icon: FileText, label: "Diagnosis History", path: "/diagnosis-history" },
  { icon: MessageSquare, label: "Chat", path: "/chat" },
];

const doctorNavItems = [
  { icon: Home, label: "Dashboard", path: "/dashboard" },
  { icon: Calendar, label: "Appointments", path: "/appointments" },
  { icon: Users, label: "My Patients", path: "/Patients" },
  { icon: MessageSquare, label: "Chat", path: "/chat" },
  { icon: Brain, label: "AI Analysis", path: "/ai-analysis" },
];

export function Sidebar() {
  const { role } = useApp();
  const pathname = usePathname();

  const navItems = role === "patient" ? patientNavItems : doctorNavItems;

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-sidebar-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
          <Stethoscope className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="font-display text-xl font-bold text-sidebar-foreground">
          EG<span className="text-primary">healthcare</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
              )}
            >
              <item.icon
                className={cn("h-5 w-5", isActive && "text-primary")}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-sidebar-border p-4">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-all duration-200 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
        >
          <Settings className="h-5 w-5" />
          Settings
        </Link>
      </div>
    </aside>
  );
}
