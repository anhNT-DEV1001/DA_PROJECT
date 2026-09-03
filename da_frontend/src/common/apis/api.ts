import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios"

import { useAuthStore } from "@/common/stores"

import type { ApiErrorResponse, ApiSuccessResponse } from "./api.type"

const baseURL = import.meta.env.VITE_API_URL?.trim()

if (!baseURL) {
  throw new Error("VITE_API_URL chưa được cấu hình")
}

const axiosConfig = {
  baseURL,
  timeout: 15_000,
  withCredentials: true,
}

export const api = axios.create(axiosConfig)

// Dùng instance riêng để request refresh không đi qua interceptor và tạo vòng lặp.
const refreshClient = axios.create(axiosConfig)

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

export interface RefreshSessionResponse {
  accessToken: string
  refreshToken: string
}

let refreshRequest: Promise<RefreshSessionResponse> | null = null

/**
 * Luồng refresh duy nhất cho cả interceptor và auth mutation.
 * Promise dùng chung ngăn nhiều response 401 cùng xoay refresh token một lúc.
 */
export const refreshSession = (): Promise<RefreshSessionResponse> => {
  refreshRequest ??= refreshClient
    .post<ApiSuccessResponse<RefreshSessionResponse>>("/auth/refresh")
    .then((response) => response.data.data)
    .finally(() => {
      refreshRequest = null
    })

  return refreshRequest
}

const shouldRefresh = (error: AxiosError<ApiErrorResponse>): boolean => {
  const config = error.config as RetryableRequestConfig | undefined
  const url = config?.url ?? ""

  return (
    error.response?.status === 401 &&
    !config?._retry &&
    !url.includes("/auth/login") &&
    !url.includes("/auth/refresh")
  )
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    if (!shouldRefresh(error) || !error.config) {
      return Promise.reject(error)
    }

    const originalRequest = error.config as RetryableRequestConfig
    originalRequest._retry = true

    try {
      await refreshSession()
      return api(originalRequest)
    } catch (refreshError) {
      // Cookie refresh không còn hợp lệ: Zustand cũng phải kết thúc auth state.
      useAuthStore.getState().clearUser()
      return Promise.reject(refreshError)
    }
  }
)
