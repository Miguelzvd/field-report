import { eq, and, count } from "drizzle-orm";
import { db } from "../../db";
import {
  services,
  checklistItems,
  photos,
  ServiceInsert,
  ServiceSelect,
  ChecklistItemInsert,
  ChecklistItemSelect,
  PhotoSelect,
  users,
} from "../../db/schema";

export interface ServiceWithUser extends ServiceSelect {
  user: { id: string; name: string; email: string }
}

export async function findServicesByUserId(
  userId: string,
): Promise<ServiceSelect[]> {
  return db.select().from(services).where(eq(services.userId, userId));
}

export async function findServiceById(
  id: string,
): Promise<ServiceSelect | undefined> {
  const result = await db
    .select()
    .from(services)
    .where(eq(services.id, id))
    .limit(1);
  return result[0];
}

export async function findServiceByIdAndUserId(
  id: string,
  userId: string,
): Promise<ServiceSelect | undefined> {
  const result = await db
    .select()
    .from(services)
    .where(and(eq(services.id, id), eq(services.userId, userId)))
    .limit(1);
  return result[0];
}

export async function createService(
  data: ServiceInsert,
): Promise<ServiceSelect> {
  const result = await db.insert(services).values(data).returning();
  return result[0];
}

export async function updateService(
  id: string,
  data: Partial<ServiceInsert>,
): Promise<ServiceSelect> {
  const result = await db
    .update(services)
    .set(data)
    .where(eq(services.id, id))
    .returning();
  return result[0];
}

export async function deleteService(id: string): Promise<void> {
  await db.delete(services).where(eq(services.id, id));
}

export async function createChecklistItems(
  items: ChecklistItemInsert[],
): Promise<ChecklistItemSelect[]> {
  return db.insert(checklistItems).values(items).returning();
}

export async function findChecklistByServiceId(
  serviceId: string,
): Promise<ChecklistItemSelect[]> {
  return db
    .select()
    .from(checklistItems)
    .where(eq(checklistItems.serviceId, serviceId));
}

export async function findPhotosByServiceId(
  serviceId: string,
): Promise<PhotoSelect[]> {
  return db.select().from(photos).where(eq(photos.serviceId, serviceId));
}
export async function findAllServicesWithUser(): Promise<ServiceWithUser[]> {
  const result = await db
    .select({
      id: services.id,
      userId: services.userId,
      type: services.type,
      status: services.status,
      notes: services.notes,
      createdAt: services.createdAt,
      finishedAt: services.finishedAt,
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
      },
    })
    .from(services)
    .innerJoin(users, eq(services.userId, users.id))
    .orderBy(services.createdAt)
  return result
}

export async function findServiceByIdForAdmin(
  id: string,
): Promise<ServiceSelect | undefined> {
  const result = await db
    .select()
    .from(services)
    .where(eq(services.id, id))
    .limit(1)
  return result[0]
}

export async function updateChecklistItem(
  id: string,
  checked: boolean,
): Promise<ChecklistItemSelect> {
  const result = await db
    .update(checklistItems)
    .set({ checked })
    .where(eq(checklistItems.id, id))
    .returning()
  return result[0]
}

export async function getAdminMetrics() {
  const totalRes = await db.select({ value: count() }).from(services);
  const totalServices = totalRes[0]?.value || 0;

  const statusRes = await db
    .select({ status: services.status, value: count() })
    .from(services)
    .groupBy(services.status);

  const openServices = statusRes.find((s) => s.status === "open")?.value || 0;
  const finishedServices =
    statusRes.find((s) => s.status === "finished")?.value || 0;

  const typeRes = await db
    .select({ type: services.type, value: count() })
    .from(services)
    .groupBy(services.type);

  const byType = typeRes.reduce(
    (acc, curr) => {
      acc[curr.type] = curr.value;
      return acc;
    },
    {} as Record<string, number>,
  );

  const techRes = await db
    .select({ value: count() })
    .from(users)
    .where(eq(users.role, "technician"));

  const totalTechnicians = techRes[0]?.value || 0;

  return {
    totalServices,
    openServices,
    finishedServices,
    totalTechnicians,
    byType,
  };
}
