import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AdminLayout } from "@/components/layout/AdminLayout"

export default async function DashboardAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/login")
  }

  return (
    <AdminLayout user={session.user}>
      {children}
    </AdminLayout>
  )
}
