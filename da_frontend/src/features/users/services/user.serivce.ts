import { api, type ApiSuccessResponse } from "@/common/apis"

const updateProfile = async (id: number, data: any) => {
  const response = await api.patch<ApiSuccessResponse<any>>(
    `/users/${id}`,
    data
  )
  return response.data.data
}

const getById = async (id: number) => {
  const response = await api.get<ApiSuccessResponse<any>>(`/users/${id}`)
  return response.data.data
}

export const userService = {
  updateProfile,
  getById,
}
