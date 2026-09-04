import type { ReactNode } from "react"
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
import RegisterPage from "@/pages/auth/RegisterPage"
import HomePage from "@/pages/home/HomePage"
import PersonalPage from "@/pages/home/PersonalPage"

function ProtectedRoute({
  children,
  title,
}: {
  children: ReactNode
  title: string
}) {
  const location = useLocation()
  const { user, sessionQuery } = useAuth()

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />

  // useAuth sẽ xóa user khi query lỗi; giữ màn hình ổn định trong một render
  // thay vì điều hướng khi auth store vẫn còn user và tạo vòng lặp route.
  if (sessionQuery.isError) return null

  return <MainLayout title={title}>{children}</MainLayout>
}

function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const user = useAuthStore((state) => state.user)
  return user ? <Navigate to="/home" replace /> : children
}

export function RouteProvider() {
  const user = useAuthStore((state) => state.user)
  const authPath = user ? "/home" : "/login"

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={authPath} replace />} />
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <RegisterPage />
            </PublicOnlyRoute>
          }
        />
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
