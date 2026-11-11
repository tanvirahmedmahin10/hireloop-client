"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth-client"
import {
  Bookmark,
  Briefcase,
  Building,
  FileText,
  LayoutDashboard,
  LogOut,
  Plus,
  Settings,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react"
import Link from "next/link"

type DashboardRole = "seeker" | "recruiter" | "admin"

type MenuItem = {
  name: string
  url: string
  icon: LucideIcon
}

const menuItems: Record<DashboardRole, MenuItem[]> = {
  seeker: [
    { name: "Dashboard", url: "/dashboard/seeker", icon: LayoutDashboard },
    { name: "Jobs", url: "/dashboard/seeker/jobs", icon: Briefcase },
    { name: "Saved Jobs", url: "/dashboard/seeker/saved-jobs", icon: Bookmark },
    { name: "Applications", url: "/dashboard/seeker/applications", icon: FileText },
    { name: "Billing", url: "/dashboard/seeker/billing", icon: Wallet },
    { name: "Settings", url: "/dashboard/seeker/settings", icon: Settings },
  ],
  recruiter: [
    { name: "Dashboard", url: "/dashboard/recruiter", icon: LayoutDashboard },
    { name: "My Company", url: "/dashboard/recruiter/company", icon: Building },
    { name: "Manage Jobs", url: "/dashboard/recruiter/manage-jobs", icon: Briefcase },
    { name: "Add Jobs", url: "/dashboard/recruiter/manage-jobs/new", icon: Plus },
    { name: "Applications", url: "/dashboard/recruiter/applications", icon: FileText },
    { name: "Settings", url: "/dashboard/recruiter/settings", icon: Settings },
  ],
  admin: [
    { name: "Dashboard", url: "/dashboard/admin", icon: LayoutDashboard },
    { name: "Users", url: "/dashboard/admin/users", icon: Users },
    { name: "Companies", url: "/dashboard/admin/companies", icon: Building },
    { name: "Jobs", url: "/dashboard/admin/jobs", icon: Briefcase },
    { name: "Payments", url: "/dashboard/admin/payments", icon: Wallet },
    { name: "Settings", url: "/dashboard/admin/settings", icon: Settings },
  ],
}

export function AppSidebar() {
    const { data: session } = authClient.useSession()
    const role = (session?.user.role || "seeker") as DashboardRole

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
        <SidebarGroup>
  <SidebarMenu>
  {
    menuItems[role].map((item) => (
      <SidebarMenuItem key={item.name}>
        <SidebarMenuButton render={<Link href={item.url} />}>
          <item.icon />
          <span>{item.name}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ))
  }
  </SidebarMenu>
</SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton render={<a href="#" />}>
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
