import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { getApiErrorMessage } from "@/common/apis"
import { useAuthStore } from "@/common/stores"
import { toast } from "@/components/ui/toast"

import { userService } from "../services"
import type { UpdateUserRequest, UserResponse } from "../types"

export const userQueryKeys = {
  all: ["users"] as const,
  detail: (id?: number) => ["users", id] as const,
}

export const useUser = (userId?: number) => {
  const queryClient = useQueryClient()
  const authUser = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)

  const targetId = userId ?? authUser?.id

  const userQuery = useQuery({
    queryKey: userQueryKeys.detail(targetId),
    queryFn: () => userService.getById(targetId!),
    enabled: Boolean(targetId),
    initialData: targetId === authUser?.id ? authUser : undefined,
  })

  const updateProfileMutation = useMutation({
    mutationFn: (data: FormData | UpdateUserRequest) => {
      if (!targetId)
        throw new Error("Không xác định được người dùng cần cập nhật.")
      return userService.updateProfile(targetId, data)
    },
    onSuccess: (updatedUser: UserResponse) => {
      if (authUser && updatedUser.id === authUser.id) {
        const mergedUser = {
          ...authUser,
          ...updatedUser,
          userRoles: updatedUser.userRoles ?? authUser.userRoles,
        }
        setUser(mergedUser)
      }
      queryClient.setQueryData(userQueryKeys.detail(targetId), updatedUser)
      queryClient.invalidateQueries({ queryKey: userQueryKeys.all })

      toast.add({
        id: "user-profile-update",
        type: "success",
        title: "Cập nhật thành công",
        description: "Thông tin cá nhân đã được lưu thành công.",
      })
    },
    onError: (error) => {
      toast.add({
        id: "user-profile-update",
        type: "error",
        title: "Cập nhật thất bại",
        description: getApiErrorMessage(error),
        priority: "high",
      })
    },
  })

  return {
    user: userQuery.data ?? authUser,
    isLoading: userQuery.isLoading,
    isUpdating: updateProfileMutation.isPending,
    updateProfile: updateProfileMutation.mutate,
    updateProfileAsync: updateProfileMutation.mutateAsync,
    refetch: userQuery.refetch,
  }
}
