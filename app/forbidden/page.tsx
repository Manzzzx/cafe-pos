import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldX } from "lucide-react"

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldX className="h-10 w-10 text-red-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">403</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Akses Ditolak</h2>
        <p className="text-gray-500 mb-8 max-w-md">
          Anda tidak memiliki izin untuk mengakses halaman ini. 
          Silakan hubungi administrator jika Anda merasa ini adalah kesalahan.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button>Kembali ke Dashboard</Button>
          </Link>
          <Link href="/auth/login">
            <Button variant="outline">Login Ulang</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
