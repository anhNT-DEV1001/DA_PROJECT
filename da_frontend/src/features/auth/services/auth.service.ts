import {
  api,
  refreshSession,
  type ApiSuccessResponse,
} from "@/common/apis"

import type {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  RefreshResponse,
} from "../types"

const login = async (payload: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<ApiSuccessResponse<LoginResponse>>(
    "/auth/login",
    payload
  )

  return response.data.data
}

const logout = async (): Promise<LogoutResponse> => {
  const response =
    await api.post<ApiSuccessResponse<LogoutResponse>>("/auth/logout")

  return response.data.data
}

const refresh = (): Promise<RefreshResponse> => refreshSession()

export const authService = {
  login,
  logout,
  refresh,
}
