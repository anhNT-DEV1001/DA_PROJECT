import type { AuthUser } from "@/features/auth/types"

export interface UpdateUserRequest {
  fullName?: string
  email?: string
  phone?: string
  gender?: string
  address?: string
  dob?: string
  avatar?: File | string
}

export type UserResponse = AuthUser
