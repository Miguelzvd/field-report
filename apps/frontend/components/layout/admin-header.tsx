"use client"

import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

const PAGE_TITLES: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/services": "Serviços",
  "/admin/technicians": "Técnicos",
}

interface AdminHeaderProps {
  onMenuClick: () => void
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const pathname = usePathname()
  const title =
    Object.entries(PAGE_TITLES).find(([key]) =>
      pathname.startsWith(key)
    )?.[1] ?? "Admin"

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          className="md:hidden flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          onClick={onMenuClick}
          aria-label="Abrir menu"
        >
          <Menu className="size-5" />
        </button>
        <h1 className="font-heading text-lg font-semibold">{title}</h1>
      </div>
      <ThemeToggle />
    </header>
  )
}
