import axios from "axios"
import { useAuthStore } from "@/store/auth.store"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001",
  headers: { "Content-Type": "application/json" },
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      typeof window !== "undefined"
    ) {
      const { user, logout } = useAuthStore.getState()
      logout()
      const path = user?.role === "admin" ? "/admin/login" : "/login"
      window.location.href = path
    }
    return Promise.reject(error)
  }
)

export default api
