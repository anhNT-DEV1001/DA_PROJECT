import { api, type ApiSuccessResponse } from "@/common/apis"
import type { UpdateUserRequest, UserResponse } from "../types"

const updateProfile = async (
  id: number,
  data: FormData | UpdateUserRequest
): Promise<UserResponse> => {
  const response = await api.patch<ApiSuccessResponse<UserResponse>>(
    `/users/${id}`,
    data
  )
  return response.data.data
}

const getById = async (id: number): Promise<UserResponse> => {
  const response = await api.get<ApiSuccessResponse<UserResponse>>(
    `/users/${id}`
  )
  return response.data.data
}

export const userService = {
  updateProfile,
  getById,
}
