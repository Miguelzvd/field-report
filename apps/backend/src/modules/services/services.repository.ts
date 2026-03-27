import { eq, and } from "drizzle-orm"
import { db } from "../../db"
import {
  services,
  checklistItems,
  photos,
  ServiceInsert,
  ServiceSelect,
  ChecklistItemInsert,
  ChecklistItemSelect,
  PhotoSelect,
} from "../../db/schema"

export async function findServicesByUserId(
  userId: string
): Promise<ServiceSelect[]> {
  return db.select().from(services).where(eq(services.userId, userId))
}

export async function findServiceById(
  id: string
): Promise<ServiceSelect | undefined> {
  const result = await db
    .select()
    .from(services)
    .where(eq(services.id, id))
    .limit(1)
  return result[0]
}

export async function findServiceByIdAndUserId(
  id: string,
  userId: string
): Promise<ServiceSelect | undefined> {
  const result = await db
    .select()
    .from(services)
    .where(and(eq(services.id, id), eq(services.userId, userId)))
    .limit(1)
  return result[0]
}

export async function createService(data: ServiceInsert): Promise<ServiceSelect> {
  const result = await db.insert(services).values(data).returning()
  return result[0]
}

export async function updateService(
  id: string,
  data: Partial<ServiceInsert>
): Promise<ServiceSelect> {
  const result = await db
    .update(services)
    .set(data)
    .where(eq(services.id, id))
    .returning()
  return result[0]
}

export async function deleteService(id: string): Promise<void> {
  await db.delete(services).where(eq(services.id, id))
}

export async function createChecklistItems(
  items: ChecklistItemInsert[]
): Promise<ChecklistItemSelect[]> {
  return db.insert(checklistItems).values(items).returning()
}

export async function findChecklistByServiceId(
  serviceId: string
): Promise<ChecklistItemSelect[]> {
  return db
    .select()
    .from(checklistItems)
    .where(eq(checklistItems.serviceId, serviceId))
}

export async function findPhotosByServiceId(
  serviceId: string
): Promise<PhotoSelect[]> {
  return db.select().from(photos).where(eq(photos.serviceId, serviceId))
}
