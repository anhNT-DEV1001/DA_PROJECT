export interface LoginRequest {
  username: string
  password: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface LoginTokens extends AuthTokens {
  sessionId: string
}

export interface AuthRole {
  id: number
  name: string
  description: string | null
  createdAt: string | null
  updatedAt: string | null
  createdBy: number | null
  updatedBy: number | null
}

export interface AuthUserRole {
  id: number
  roleId: number
  userId: number
  role?: AuthRole
  createdAt: string | null
  updatedAt: string | null
  createdBy: number | null
  updatedBy: number | null
}

// UserResponse phía backend được tạo bằng PartialType nên các trường đều optional.
export interface AuthUser {
  id?: number
  username?: string
  fullName?: string
  email?: string | null
  phone?: string | null
  gender?: string | null
  avatar?: string | null
  userRoles?: AuthUserRole[]
  createdAt?: string | null
  updatedAt?: string | null
  createdBy?: number | null
  updatedBy?: number | null
  deletedAt?: string | null
  deletedBy?: number | null
}

export interface LoginResponse {
  user: AuthUser
  token: LoginTokens
}

export type LogoutResponse = AuthUser

export type RefreshResponse = AuthTokens
