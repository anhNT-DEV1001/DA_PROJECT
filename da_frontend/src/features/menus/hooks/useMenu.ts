import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"

import { useAuthStore } from "@/common/stores"

import { menuService } from "../services"
import type { MenuSidbarResponse } from "../types"

export const menuQueryKeys = {
  all: ["menus"] as const,
  sidebar: () => [...menuQueryKeys.all, "sidebar"] as const,
}

export interface UseMenuOptions {
  enabled?: boolean
}

export interface NavMainItem {
  id?: number
  title: string
  url: string
  icon?: string | null
  isActive?: boolean
  items?: {
    id?: number
    title: string
    url: string
    icon?: string | null
  }[]
}

/**
 * Xử lý phân cấp menu:
 * - Nếu item có parentId null (hoặc không có con) thì là menu con/đơn ở cấp root.
 * - Nếu có parentId thì gắn vào mảng children của menu cha tương ứng.
 * - Hỗ trợ cả dữ liệu mảng phẳng (flat array) lẫn dữ liệu cây (nested tree) từ API.
 */
export const buildMenuTree = (
  menus: MenuSidbarResponse[] = []
): MenuSidbarResponse[] => {
  // Kiểm tra nếu API đã trả về cấu trúc tree sẵn (có children chứa phần tử)
  const isAlreadyTree = menus.some((m) => m.children && m.children.length > 0)
  if (isAlreadyTree) {
    return menus
      .filter((m) => m.parentId === null || m.parentId === undefined)
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
  }

  // Nếu API trả về mảng phẳng (flat list), tự động nhóm theo parentId
  const nodeMap = new Map<number, MenuSidbarResponse>()
  const rootNodes: MenuSidbarResponse[] = []

  menus.forEach((item) => {
    nodeMap.set(item.id, {
      ...item,
      children: item.children ? [...item.children] : [],
    })
  })

  menus.forEach((item) => {
    const node = nodeMap.get(item.id)!
    // parentId null tức là menu ở cấp ngoài cùng
    if (item.parentId === null || item.parentId === undefined) {
      rootNodes.push(node)
    } else {
      // Có parentId: đây là menu con (children) của menu cha
      const parentNode = nodeMap.get(item.parentId)
      if (parentNode) {
        parentNode.children = parentNode.children || []
        parentNode.children.push(node)
      } else {
        rootNodes.push(node)
      }
    }
  })

  // Sắp xếp các menu cha và menu con theo displayOrder
  rootNodes.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
  rootNodes.forEach((parent) => {
    if (parent.children?.length) {
      parent.children.sort(
        (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
      )
    }
  })

  return rootNodes
}

/**
 * Chuyển đổi danh sách menu từ API thành format cho NavMain
 */
export const transformMenusToNavItems = (
  menus: MenuSidbarResponse[] = []
): NavMainItem[] => {
  const tree = buildMenuTree(menus)

  return tree.map((menu) => {
    const hasChildren = Boolean(menu.children && menu.children.length > 0)

    return {
      id: menu.id,
      title: menu.name,
      url: menu.route?.trim() ? menu.route : "#",
      icon: menu.icon,
      items: hasChildren
        ? menu.children!.map((child) => ({
            id: child.id,
            title: child.name,
            url: child.route?.trim() ? child.route : "#",
            icon: child.icon,
          }))
        : undefined,
    }
  })
}

export const useMenu = (options?: UseMenuOptions) => {
  const user = useAuthStore((state) => state.user)

  const sidebarQuery = useQuery({
    queryKey: menuQueryKeys.sidebar(),
    queryFn: menuService.getSidbarMenu,
    enabled: Boolean(user) && (options?.enabled ?? true),
    staleTime: 5 * 60 * 1000,
  })

  const sidebarMenus = sidebarQuery.data ?? []

  const menuTree = useMemo(() => buildMenuTree(sidebarMenus), [sidebarMenus])

  const navItems = useMemo(
    () => transformMenusToNavItems(sidebarMenus),
    [sidebarMenus]
  )

  return {
    sidebarMenus,
    menuTree,
    navItems,
    isLoading: sidebarQuery.isLoading,
    isPending: sidebarQuery.isPending,
    isError: sidebarQuery.isError,
    error: sidebarQuery.error,
    refetch: sidebarQuery.refetch,
    sidebarQuery,
  }
}
