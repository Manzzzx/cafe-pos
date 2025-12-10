import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { CashierLayout } from "@/components/layout/CashierLayout"

export default async function CashierOrdersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/login")
  }

  return (
    <CashierLayout user={session.user}>
      {children}
    </CashierLayout>
  )
}
