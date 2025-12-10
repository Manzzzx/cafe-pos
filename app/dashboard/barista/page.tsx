import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChefHat } from "lucide-react"
import Link from "next/link"

export default async function BaristaDashboardPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/auth/login")
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard Barista</h1>
        <p className="text-gray-500">Selamat datang, {session.user.name || session.user.email}</p>
      </div>

      <div className="max-w-md">
        <Link href="/kitchen">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="h-20 w-20 bg-[#2C1A12] rounded-full flex items-center justify-center mb-4">
                <ChefHat className="h-10 w-10 text-white" />
              </div>
              <h3 className="font-semibold text-2xl mb-2">Kitchen Display</h3>
              <p className="text-gray-500 mb-4">Lihat dan kelola pesanan yang masuk</p>
              <Button size="lg" className="w-full bg-[#2C1A12] hover:bg-[#4A3728]">
                Buka Kitchen Display
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
