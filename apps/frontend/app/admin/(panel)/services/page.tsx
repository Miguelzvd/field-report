"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { ServicesTable } from "@/components/admin/services-table"
import { useAdminServices } from "@/hooks/use-admin"

export default function AdminServicesPage() {
  const { services, loading } = useAdminServices()

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground">
          {services.length} serviço{services.length !== 1 ? "s" : ""} no total
        </p>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <ServicesTable services={services} />
      )}
    </div>
  )
}
