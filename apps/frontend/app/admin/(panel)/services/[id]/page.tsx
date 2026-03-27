"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Checklist } from "@/components/services/checklist";
import { useAdminServiceDetail } from "@/hooks/use-admin";
import { SERVICE_TYPE_LABELS, SERVICE_STATUS_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

export default function AdminServiceDetailPage({ params }: Props) {
  const { id } = use(params);
  const { service, loading } = useAdminServiceDetail(id);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  if (!service) return null;

  const isFinished = service.status === "finished";

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <Button
          variant="outline"
          size="icon"
          className="size-9 shrink-0"
          nativeButton={false}
          render={<Link href="/admin/services" />}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-xl font-bold">
              {SERVICE_TYPE_LABELS[service.type]}
            </h2>
            <Badge
              className={cn(
                "text-[10px]",
                isFinished
                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                  : "bg-amber-500/15 text-amber-700 dark:text-amber-400",
              )}
            >
              {SERVICE_STATUS_LABELS[service.status]}
            </Badge>
          </div>
          <p className="font-mono text-xs text-muted-foreground">
            #{id.slice(0, 8).toUpperCase()}
          </p>
        </div>
      </div>

      {service.user && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <User className="size-4" />
              Técnico responsável
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">{service.user.name}</p>
            <p className="text-xs text-muted-foreground">{service.user.email}</p>
          </CardContent>
        </Card>
      )}

      {service.checklist && service.checklist.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <Checklist items={service.checklist} serviceId={id} readOnly />
          </CardContent>
        </Card>
      )}

      {service.photos && service.photos.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Fotos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {service.photos.map((photo) => (
                <div
                  key={photo.id}
                  className="relative aspect-square overflow-hidden rounded-lg border border-border"
                >
                  <Image
                    src={photo.url}
                    alt="Foto do serviço"
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {isFinished && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Observação do serviço</CardTitle>
          </CardHeader>
          <CardContent>
            {service.notes ? (
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {service.notes}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Nenhuma observação registrada para este serviço.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
