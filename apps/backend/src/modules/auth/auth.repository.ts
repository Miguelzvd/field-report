import { eq } from "drizzle-orm"
import { db } from "../../db"
import { users, UserInsert, UserSelect } from "../../db/schema"

export async function findUserByEmail(
  email: string
): Promise<UserSelect | undefined> {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1)

  return result[0]
}

export async function findUserById(
  id: string
): Promise<UserSelect | undefined> {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1)

  return result[0]
}

export async function createUser(data: UserInsert): Promise<UserSelect> {
  const result = await db.insert(users).values(data).returning()
  return result[0]
}
