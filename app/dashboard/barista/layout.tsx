import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { BaristaLayout } from "@/components/layout/BaristaLayout"

export default async function DashboardBaristaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/login")
  }

  return (
    <BaristaLayout user={session.user}>
      {children}
    </BaristaLayout>
  )
}
