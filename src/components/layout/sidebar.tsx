"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  MessageCircle, 
  Settings, 
  BarChart2, 
  Upload, 
  Phone 
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { 
      href: "/dashboard", 
      icon: Home, 
      label: "Dashboard" 
    },
    { 
      href: "/chat", 
      icon: MessageCircle, 
      label: "Chat" 
    },
    { 
      href: "/analytics", 
      icon: BarChart2, 
      label: "Analytics" 
    },
    { 
      href: "/upload", 
      icon: Upload, 
      label: "Upload" 
    },
    { 
      href: "/settings", 
      icon: Settings, 
      label: "Configurações" 
    },
    { 
      href: "/settings/voice", 
      icon: Phone, 
      label: "Assistente de Voz" 
    }
  ];

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="">AssistPro AI</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                  pathname === item.href 
                    ? "bg-muted text-primary" 
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
