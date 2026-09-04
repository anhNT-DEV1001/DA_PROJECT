import * as React from "react"
import { DynamicIcon, iconNames, type IconName } from "lucide-react/dynamic"

const iconSet = new Set<string>(iconNames)

/**
 * Chuẩn hóa tên icon sang kebab-case để tra cứu trong lucide-react.
 * Hỗ trợ các kiểu định dạng:
 * - PascalCase: "TerminalSquare", "Bot", "Settings2"
 * - Có hậu tố Icon: "TerminalSquareIcon", "BotIcon"
 * - kebab-case: "terminal-square", "settings-2"
 * - snake_case: "terminal_square", "settings_2"
 */
export const normalizeLucideIconName = (
  name?: string | null
): IconName | null => {
  if (!name) return null
  const cleaned = name
    .trim()
    .replace(/Icon$/, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase()

  if (iconSet.has(cleaned)) {
    return cleaned as IconName
  }
  return null
}

export interface MenuIconProps {
  name?: string | null
  className?: string
  size?: number | string
  fallback?: React.ReactNode
}

export function MenuIcon({
  name,
  className,
  size = 16,
  fallback = null,
}: MenuIconProps) {
  const iconName = normalizeLucideIconName(name)

  if (!iconName) {
    return fallback ? <>{fallback}</> : null
  }

  const fallbackRender = fallback ? () => <>{fallback}</> : undefined

  return (
    <DynamicIcon
      name={iconName}
      size={size}
      className={className}
      fallback={fallbackRender}
    />
  )
}
