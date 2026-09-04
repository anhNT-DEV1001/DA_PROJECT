import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const DEFAULT_AVATAR = "/default-avatar.svg"

/**
 * Trả về URL ảnh đại diện đầy đủ, hoặc fallback về avatar mặc định nếu chưa có
 */
export function getAvatarUrl(avatarPath?: string | null): string {
  if (!avatarPath || avatarPath === "null" || avatarPath === "undefined") {
    return DEFAULT_AVATAR
  }

  const trimmed = avatarPath.trim()
  if (!trimmed) return DEFAULT_AVATAR

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed
  }

  const uploadBaseUrl = (import.meta.env.VITE_API_UPLOAD ?? "")
    .trim()
    .replace(/\/+$/, "")
  const cleanPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`

  return `${uploadBaseUrl}${cleanPath}`
}

/**
 * Lấy 1-2 chữ cái đại diện từ tên người dùng
 */
export function getInitials(name?: string | null): string {
  if (!name) return "U"
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return "U"
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}
