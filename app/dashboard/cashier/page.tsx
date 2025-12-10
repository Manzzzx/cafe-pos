import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, ClipboardList, Clock } from "lucide-react"
import Link from "next/link"

export default async function CashierDashboardPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/auth/login")
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard Kasir</h1>
        <p className="text-gray-500">Selamat datang, {session.user.name || session.user.email}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
        <Link href="/pos">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-[#6F4E37] rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Buka Kasir (POS)</h3>
              <p className="text-sm text-gray-500 mb-4">Mulai transaksi penjualan</p>
              <Button className="w-full bg-[#6F4E37] hover:bg-[#5a3f2d]">
                Buka POS
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/orders">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <ClipboardList className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Riwayat Pesanan</h3>
              <p className="text-sm text-gray-500 mb-4">Lihat pesanan sebelumnya</p>
              <Button variant="outline" className="w-full">
                Lihat Riwayat
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Card className="mt-6 max-w-2xl">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-gray-500">
            <Clock className="h-5 w-5" />
            <span>Shift aktif sejak login</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
