import { api, refreshSession, type ApiSuccessResponse } from "@/common/apis"

import type {
  AuthUser,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  RefreshResponse,
  RegisterRequest,
  RegisterResponse,
} from "../types"

interface CurrentAuthResponse {
  user: AuthUser
}

const register = async (
  payload: RegisterRequest
): Promise<RegisterResponse> => {
  const response = await api.post<ApiSuccessResponse<RegisterResponse>>(
    "/auth/register",
    payload
  )

  return response.data.data
}

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

const getCurrentUser = async (): Promise<AuthUser> => {
  const response =
    await api.get<ApiSuccessResponse<CurrentAuthResponse>>("/auth/me")

  return response.data.data.user
}

const refresh = (): Promise<RefreshResponse> => refreshSession()

export const authService = {
  register,
  login,
  getCurrentUser,
  logout,
  refresh,
}
