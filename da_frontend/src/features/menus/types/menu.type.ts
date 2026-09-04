export type MenuSidbarResponse = {
  id: number
  createdAt: string | Date | null
  updatedAt: string | Date | null
  createdBy: number | null
  updatedBy: number | null
  name: string
  route: string | null
  icon: string | null
  alias: string
  parentId: number | null
  displayOrder: number
  isSideBarDisplay: boolean
  isActive: boolean
  children?: MenuSidbarResponse[]
}

export type MenuSidebarResponse = MenuSidbarResponse
