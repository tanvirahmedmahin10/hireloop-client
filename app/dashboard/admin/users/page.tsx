import type { Metadata } from "next"

import { ManageUsers, type AdminUser } from "@/components/admin/manage-users"
import { getUsers } from "@/lib/actions/user"

export const metadata: Metadata = {
  title: "User Management · HireLoop",
  description: "Review, filter, and manage platform access for all users.",
}

const AdminUsersPage = async () => {
  let users: AdminUser[] = []
  try {
    // auth.api.listUsers returns { users: [...] }. It types role as a plain
    // string and dates as Date, so we narrow to our AdminUser shape here.
    const result = await getUsers()
    users = (result?.users ?? []) as unknown as AdminUser[]
  } catch {
    // Non-admin sessions get denied by better-auth — render the table empty.
    // TODO: surface an "admin access required" state here.
  }

  return <ManageUsers users={users} />
}

export default AdminUsersPage
