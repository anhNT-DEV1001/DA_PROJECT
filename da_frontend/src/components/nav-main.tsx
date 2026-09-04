import * as React from "react"
import { Link } from "react-router-dom"
import { ChevronRightIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { MenuIcon } from "@/components/menu-icon"

export interface NavMainItemProps {
  id?: number
  title: string
  url: string
  icon?: string | React.ReactNode | null
  isActive?: boolean
  items?: {
    id?: number
    title: string
    url: string
    icon?: string | React.ReactNode | null
  }[]
}

const renderNavigationLink = (url: string) => {
  if (url && url.startsWith("/") && !url.startsWith("//")) {
    return <Link to={url} />
  }
  return <a href={url || "#"} />
}

const renderIcon = (icon?: string | React.ReactNode | null) => {
  if (!icon) return null
  if (typeof icon === "string") {
    return <MenuIcon name={icon} />
  }
  return icon
}

export function NavMain({ items }: { items: NavMainItemProps[] }) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const hasChildren = Boolean(item.items && item.items.length > 0)

          // 1. Nếu không có menu con (menu đơn / leaf item) -> Render nút bấm trực tiếp không có Collapsible
          if (!hasChildren) {
            return (
              <SidebarMenuItem key={item.id ?? item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  isActive={item.isActive}
                  render={renderNavigationLink(item.url)}
                >
                  {renderIcon(item.icon)}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          }

          // 2. Nếu có menu con (children) -> Render Collapsible dropdown
          return (
            <Collapsible
              key={item.id ?? item.title}
              defaultOpen={item.isActive}
              className="group/collapsible"
              render={<SidebarMenuItem />}
            >
              <CollapsibleTrigger
                render={<SidebarMenuButton tooltip={item.title} />}
              >
                {renderIcon(item.icon)}
                <span>{item.title}</span>
                <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-open/collapsible:rotate-90" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.id ?? subItem.title}>
                      <SidebarMenuSubButton
                        render={renderNavigationLink(subItem.url)}
                      >
                        {renderIcon(subItem.icon)}
                        <span>{subItem.title}</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
