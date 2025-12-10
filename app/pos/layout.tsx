import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { CashierLayout } from "@/components/layout/CashierLayout"

export default async function POSLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/login")
  }

  // For POS, we use a minimal wrapper since POS has its own full-screen layout
  // But we still want the cashier header for navigation
  return (
    <CashierLayout user={session.user}>
      {children}
    </CashierLayout>
  )
}
