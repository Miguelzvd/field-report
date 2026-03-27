import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface MetricsCardProps {
  label: string
  value: number | string
  icon: LucideIcon
  description?: string
  accent?: boolean
  className?: string
}

export function MetricsCard({
  label,
  value,
  icon: Icon,
  description,
  accent = false,
  className,
}: MetricsCardProps) {
  return (
    <Card 
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1",
        accent 
          ? "border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background" 
          : "border-border/50 bg-card hover:border-border",
        className
      )}
    >
      {accent && (
        <div className="absolute top-0 right-0 -mt-6 -mr-6 size-32 rounded-full bg-primary/10 blur-3xl transition-all duration-500 group-hover:bg-primary/20" />
      )}
      <CardContent className="p-6 relative z-10">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              {label}
            </p>
            <p className="text-3xl font-heading font-bold text-foreground tracking-tight">
              {value}
            </p>
            {description && (
              <p className="text-xs text-muted-foreground mt-2">{description}</p>
            )}
          </div>
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
              accent
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                : "bg-secondary text-secondary-foreground"
            )}
          >
            <Icon className="size-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
