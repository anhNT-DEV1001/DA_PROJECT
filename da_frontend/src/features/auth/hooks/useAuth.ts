import { useEffect } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { getApiErrorMessage } from "@/common/apis"
import { useAuthStore } from "@/common/stores"
import { toast } from "@/components/ui/toast"

import { authService } from "../services"
import type { AuthUser } from "../types"

export const authQueryKeys = {
  all: ["auth"] as const,
  currentUser: ["auth", "current-user"] as const,
}

export const useAuth = () => {
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const clearUser = useAuthStore((state) => state.clearUser)

  const sessionQuery = useQuery({
    queryKey: authQueryKeys.currentUser,
    queryFn: authService.getCurrentUser,
    enabled: user !== null,
    retry: false,
    staleTime: 5 * 60 * 1000,
  })

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: ({ user }) => {
      setUser(user)
      queryClient.setQueryData<AuthUser>(authQueryKeys.currentUser, user)
      toast.add({
        id: "auth-login",
        type: "success",
        title: "Đăng nhập thành công",
        description: `Chào mừng ${user.fullName ?? user.username ?? "bạn"} quay lại.`,
      })
    },
    onError: (error) =>
      toast.add({
        id: "auth-login",
        type: "error",
        title: "Đăng nhập thất bại",
        description: getApiErrorMessage(error),
        priority: "high",
      }),
  })

  // Đồng bộ user đã persist với session thật trên server. Nếu access token hết
  // hạn, interceptor sẽ refresh đúng một lần rồi request lại /auth/me.
  useEffect(() => {
    if (sessionQuery.data) setUser(sessionQuery.data)
  }, [sessionQuery.data, setUser])

  // Mọi lỗi khi kiểm tra session đều phải xóa auth state cục bộ. Nếu giữ user
  // đã persist, /login sẽ đẩy về /home trong khi /home lại đẩy về /login.
  useEffect(() => {
    if (sessionQuery.isError) clearUser()
  }, [clearUser, sessionQuery.isError])

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      clearUser()
      queryClient.removeQueries({ queryKey: authQueryKeys.all })
      toast.add({
        id: "auth-logout",
        type: "success",
        title: "Đăng xuất thành công",
      })
    },
    onError: (error) =>
      toast.add({
        id: "auth-logout",
        type: "error",
        title: "Đăng xuất thất bại",
        description: getApiErrorMessage(error),
        priority: "high",
      }),
  })

  const refreshMutation = useMutation({
    mutationFn: authService.refresh,
    onError: (error) => {
      clearUser()
      queryClient.removeQueries({ queryKey: authQueryKeys.all })
      toast.add({
        id: "auth-refresh",
        type: "error",
        title: "Phiên đăng nhập không hợp lệ",
        description: getApiErrorMessage(error),
        priority: "high",
      })
    },
  })

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      toast.add({
        id: "auth-register",
        type: "success",
        title: "Đăng ký thành công",
        description: "Tài khoản đã được tạo thành công! Vui lòng đăng nhập.",
      })
    },
    onError: (error) =>
      toast.add({
        id: "auth-register",
        type: "error",
        title: "Đăng ký thất bại",
        description: getApiErrorMessage(error),
        priority: "high",
      }),
  })

  const isLoading =
    loginMutation.isPending ||
    logoutMutation.isPending ||
    refreshMutation.isPending ||
    registerMutation.isPending

  return {
    user,
    sessionQuery,
    isAuthenticated: user !== null,
    isLoading,
    loginMutation,
    registerMutation,
    logoutMutation,
    refreshMutation,
  }
}
