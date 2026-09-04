import { useEffect, type ReactNode } from "react"
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom"

import { useAuthStore } from "@/common/stores"
import MainLayout from "@/components/layouts/MainLayout"
import { useAuth } from "@/features/auth/hooks"
import LoginPage from "@/pages/auth/LoginPage"
import HomePage from "@/pages/home/HomePage"
import PersonalPage from "@/pages/home/PersonalPage"
import { Loader2 } from "lucide-react"

function ProtectedRoute({
  children,
  title,
}: {
  children: ReactNode
  title: string
}) {
  const location = useLocation()
  const { user, refreshMutation } = useAuth()
  const { isError, isIdle, isPending, mutate: refresh } = refreshMutation

  useEffect(() => {
    if (user && isIdle) refresh()
  }, [isIdle, refresh, user])

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />

  if (isIdle || isPending) {
    return (
      <main className="grid min-h-svh place-items-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </main>
    )
  }

  if (isError) return <Navigate to="/login" replace />

  return <MainLayout title={title}>{children}</MainLayout>
}

function PublicOnlyRoute() {
  const user = useAuthStore((state) => state.user)
  return user ? <Navigate to="/home" replace /> : <LoginPage />
}

export function RouteProvider() {
  const user = useAuthStore((state) => state.user)
  const authPath = user ? "/home" : "/login"

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={authPath} replace />} />
        <Route path="/login" element={<PublicOnlyRoute />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute title="Trang chủ">
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/personal"
          element={
            <ProtectedRoute title="Thông tin cá nhân">
              <PersonalPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={authPath} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
