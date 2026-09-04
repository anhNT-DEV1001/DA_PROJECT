import { api, type ApiSuccessResponse } from "@/common/apis"
import type { MenuSidbarResponse } from "../types"

const getSidbarMenu = async (): Promise<MenuSidbarResponse[]> => {
  const response =
    await api.get<ApiSuccessResponse<MenuSidbarResponse[]>>("/menus/sidebar")
  return response.data.data
}

export const menuService = {
  getSidbarMenu,
  getSidebarMenu: getSidbarMenu,
}
