"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

/** The roles a platform user can have — matches better-auth's configured user.role. */
export type UserRole = "admin" | "recruiter" | "seeker"

/** A better-auth user record, as returned by admin.listUsers. Role is optional because older records may not have one. */
export interface AdminUser {
  id: string
  name: string
  email: string
  emailVerified: boolean
  role?: UserRole
  createdAt: string | Date
  updatedAt: string | Date
}

const roleOptions: UserRole[] = ["seeker", "recruiter", "admin"]

/** Badge classes per role — the dot and text share the role's color. */
const roleStyles: Record<UserRole, string> = {
  admin: "border-[#5c53fe]/30 bg-[#5c53fe]/10 text-[#8b84fe]",
  recruiter: "border-[#60a5fa]/30 bg-[#60a5fa]/10 text-[#60a5fa]",
  seeker: "border-[#22c55e]/30 bg-[#22c55e]/10 text-[#22c55e]",
}

const formatDate = (iso: string | Date) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

type RoleFilter = "all" | UserRole

/** Admin view: review every platform user and change their role. */
export function ManageUsers({ users }: { users: AdminUser[] }) {
  const [search, setSearch] = React.useState("")
  const [roleFilter, setRoleFilter] = React.useState<RoleFilter>("all")
  // Role per user id — kept locally until the database update is wired.
  // better-auth types role as a plain string, so narrow it to our union here.
  const [roles, setRoles] = React.useState<Record<string, UserRole>>(() =>
    Object.fromEntries(
      users.map((user) => [user.id, (user.role ?? "seeker") as UserRole])
    )
  )

  // NOTE: change the state here first; persisting is left as a TODO.
  const handleRoleChange = (userId: string, role: UserRole) => {
    setRoles((prev) => ({ ...prev, [userId]: role }))
    // TODO: persist to the database here — better-auth already ships this:
    // await authClient.admin.setRole({ userId, role })
  }

  const filtered = users.filter((user) => {
    const matchesSearch = `${user.name} ${user.email}`
      .toLowerCase()
      .includes(search.trim().toLowerCase())
    const matchesRole = roleFilter === "all" || roles[user.id] === roleFilter
    return matchesSearch && matchesRole
  })

  const countFor = (filter: RoleFilter) =>
    filter === "all" ? users.length : users.filter((user) => roles[user.id] === filter).length

  return (
    <div className="mx-auto w-full max-w-[1120px] px-5 py-8 sm:px-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold text-[#ededef]">User Management</h1>
          <p className="mt-1 text-[13px] text-[#a0a0ab]">
            Review, filter, and manage platform access for all users.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1 rounded-[10px] border border-white/[0.08] bg-[#1a1a1f] p-1">
          {(["all", "admin", "recruiter", "seeker"] as RoleFilter[]).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setRoleFilter(filter)}
              className={cn(
                "h-8 rounded-[8px] px-3 text-[13px] transition-colors",
                roleFilter === filter ? "bg-[#232327] text-white" : "text-[#a0a0ab] hover:text-white"
              )}
            >
              {filter === "all" ? "All" : filter.charAt(0).toUpperCase() + filter.slice(1)} ({countFor(filter)})
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#6e6e78]" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search users by name or email…"
            className="h-9 w-[260px] rounded-[10px] border border-white/[0.08] bg-[#0c0c0f] pl-9 pr-3 text-[13px] text-[#ededef] placeholder:text-[#6e6e78] focus:border-white/20 focus:outline-none"
          />
        </div>
      </div>

      {/* Users table */}
      <div className="mt-6 overflow-hidden rounded-[16px] border border-white/[0.06] bg-[#141418]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="bg-[#1a1a1f]">
                {["User", "Joined", "Email Verified", "Role"].map((heading) => (
                  <th key={heading} className="px-4 py-3 text-[11px] font-medium text-[#6e6e78]">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-white/[0.06] transition-colors hover:bg-white/[0.02]"
                >
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2.5">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-[4px] bg-[#222228] text-xs text-[#ededef]">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[13px] font-medium text-[#ededef]">
                          {user.name}
                        </span>
                        <span className="block truncate text-xs text-[#a0a0ab]" title={user.email}>
                          {user.email}
                        </span>
                      </span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#a0a0ab]">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium",
                        user.emailVerified
                          ? "border-[#22c55e]/30 bg-[#22c55e]/10 text-[#22c55e]"
                          : "border-white/10 bg-white/5 text-[#a1a4aa]"
                      )}
                    >
                      {user.emailVerified ? "Verified" : "Unverified"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
                          roleStyles[roles[user.id] ?? "seeker"]
                        )}
                      >
                        <span className="size-1.5 rounded-full bg-current" />
                        {roles[user.id] ?? "seeker"}
                      </span>
                      <Select
                        value={roles[user.id] ?? "seeker"}
                        onValueChange={(value) => handleRoleChange(user.id, value as UserRole)}
                      >
                        <SelectTrigger className="h-9 w-[130px] justify-between rounded-[8px] border border-white/10 bg-[#0c0c0f] px-3 text-[13px] text-[#ededef] [&_svg]:text-[#a1a4aa]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border border-white/10 bg-[#1e1e21] text-[#ededef] ring-0">
                          {roleOptions.map((role) => (
                            <SelectItem
                              key={role}
                              value={role}
                              className="capitalize focus:bg-[#2c2c31] focus:text-white"
                            >
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-[13px] text-[#a0a0ab]">
                    No users match your filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="border-t border-white/[0.06] bg-[#1a1a1f] px-6 py-4 text-[13px] text-[#a0a0ab]">
          {filtered.length} user{filtered.length === 1 ? "" : "s"}
        </div>
      </div>
    </div>
  )
}
