"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

interface AuthUser {
  id: string
  name: string
  email: string
  role: string
}

interface AuthState {
  user: AuthUser | null
  accessToken: string | null
  login: (user: AuthUser, accessToken: string) => void
  logout: () => void
  isAdmin: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      login: (user, accessToken) => set({ user, accessToken }),
      logout: () => set({ user: null, accessToken: null }),
      isAdmin: () => get().user?.role === "admin",
    }),
    {
      name: "field-report-auth",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
