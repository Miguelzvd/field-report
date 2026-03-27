"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth.store"

export default function RootPage() {
  const router = useRouter()
  const { accessToken, isAdmin } = useAuthStore()

  useEffect(() => {
    if (!accessToken) {
      router.replace("/login")
    } else if (isAdmin()) {
      router.replace("/admin/dashboard")
    } else {
      router.replace("/dashboard")
    }
  }, [accessToken, isAdmin, router])

  return null
}
