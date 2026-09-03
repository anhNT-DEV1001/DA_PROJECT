import { AxiosError } from "axios"

export interface ApiSuccessResponse<T> {
  statusCode: number
  success: true
  message: string
  data: T
  timestamp: string
}

export interface ApiErrorResponse {
  statusCode: number
  success: false
  message: string | string[]
  error: string
  path?: string
  timestamp: string
}

export type ApiError = AxiosError<ApiErrorResponse>

export const isApiError = (error: unknown): error is ApiError => {
  if (!(error instanceof AxiosError)) return false

  const data = error.response?.data

  return (
    typeof data === "object" &&
    data !== null &&
    "success" in data &&
    data.success === false
  )
}

export const getApiErrorMessage = (error: unknown): string => {
  if (!isApiError(error)) return "Không thể kết nối đến máy chủ."

  const { message } = error.response!.data
  return Array.isArray(message) ? message.join("\n") : message
}
