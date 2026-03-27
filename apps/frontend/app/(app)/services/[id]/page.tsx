"use client";

import Link from "next/link";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Trash2,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Checklist } from "@/components/services/checklist";
import { PhotoUpload } from "@/components/services/photo-upload";
import {
  useServiceDetail,
  useToggleChecklist,
  useFinishService,
  useDeleteService,
  useSaveNotes,
} from "@/hooks/use-services";
import { SERVICE_TYPE_LABELS, SERVICE_STATUS_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

export default function ServiceDetailPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const { service, loading, refetch } = useServiceDetail(id);
  const { toggleItem } = useToggleChecklist();
  const { finishService, loading: finishing } = useFinishService();
  const { deleteService, loading: deleting } = useDeleteService();
  const { saveNotes, loading: savingNotes } = useSaveNotes();

  const [cancelOpen, setCancelOpen] = useState(false);
  const [notes, setNotes] = useState<string | null>(null);

  // Inicializa notes com o valor atual do serviço (apenas uma vez)
  if (service && notes === null) {
    setNotes(service.notes ?? "");
  }

  const handleToggle = async (itemId: string, checked: boolean) => {
    await toggleItem(id, itemId, checked);
  };

  const handleFinish = async () => {
    const ok = await finishService(id);
    if (ok) await refetch();
  };

  const handleConfirmCancel = async () => {
    const ok = await deleteService(id);
    if (ok) router.replace("/dashboard");
  };

  const handleSaveNotes = async () => {
    const ok = await saveNotes(id, notes ?? "");
    if (ok) await refetch();
  };

  if (loading) {
    return (
      <div className="space-y-4 px-4 py-5">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-56 w-full rounded-xl" />
      </div>
    );
  }

  if (!service) return null;

  const isFinished = service.status === "finished";
  const currentNotes = notes ?? "";
  const canEditNotes = !isFinished || !service.notes;

  return (
    <>
      <div className="relative flex flex-col gap-5 min-h-full max-w-6xl mx-auto py-8 px-4">
        {/* Back + Title */}
        <div className="flex items-start gap-3">
          <Button
            render={<Link href="/dashboard" />}
            nativeButton={false}
            variant="ghost"
            size="icon"
            className="mt-0.5 size-9 shrink-0"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-xl font-bold leading-none">
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
            <p className="mt-1 font-mono text-[11px] text-muted-foreground">
              #{id.slice(0, 8).toUpperCase()}
            </p>
          </div>
        </div>

        {/* Checklist */}
        {service.checklist && (
          <div className="rounded-xl border border-border bg-card p-4">
            <Checklist
              items={service.checklist}
              serviceId={id}
              readOnly={isFinished}
              onToggle={handleToggle}
            />
          </div>
        )}

        {/* Observação do serviço — editável */}
        {canEditNotes && (
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <p className="text-sm font-semibold">Observação do serviço</p>
            <textarea
              rows={4}
              maxLength={500}
              value={currentNotes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Descreva detalhes do atendimento..."
              className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {currentNotes.length}/500
              </span>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5"
                onClick={handleSaveNotes}
                disabled={savingNotes}
              >
                {savingNotes ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Save className="size-3.5" />
                )}
                Salvar observação
              </Button>
            </div>
          </div>
        )}

        {/* Observação do serviço — somente leitura */}
        {isFinished && service.notes && (
          <div className="rounded-xl border border-border bg-card p-4 space-y-1">
            <p className="text-sm font-semibold">Observação do serviço</p>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {service.notes}
            </p>
          </div>
        )}

        {/* Photos */}
        {!isFinished && (
          <div className="rounded-xl border border-border bg-card p-4">
            <PhotoUpload serviceId={id} />
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2 pb-2">
          {!isFinished && (
            <>
              <Button
                className="w-full gap-2"
                onClick={handleFinish}
                disabled={finishing}
              >
                {finishing ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="size-4" />
                )}
                {finishing ? "Finalizando..." : "Finalizar serviço"}
              </Button>

              <Button
                variant="outline"
                className="w-full gap-2 text-destructive hover:text-destructive"
                onClick={() => setCancelOpen(true)}
                disabled={deleting}
              >
                <Trash2 className="size-4" />
                Cancelar serviço
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Dialog de confirmação de cancelamento */}
      {cancelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setCancelOpen(false)}
          />
          <div className="relative z-10 mx-4 w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl">
            <h3 className="font-heading text-lg font-bold">Cancelar serviço</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Tem certeza que deseja cancelar este serviço? Esta ação não pode
              ser desfeita.
            </p>
            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setCancelOpen(false)}
                disabled={deleting}
              >
                Voltar
              </Button>
              <Button
                variant="destructive"
                className="flex-1 gap-2"
                onClick={handleConfirmCancel}
                disabled={deleting}
              >
                {deleting && <Loader2 className="size-4 animate-spin" />}
                Confirmar cancelamento
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
