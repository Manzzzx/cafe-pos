"use client"

import { useEffect, useState } from "react"
import QRCode from "qrcode"

interface QRISDisplayProps {
  merchantName: string
  amount: number
}

export function QRISDisplay({ merchantName, amount }: QRISDisplayProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("")

  useEffect(() => {
    // Generate static QRIS data
    // In production, this would be a real QRIS string from payment gateway
    // For demo, we create a simple payload
    const qrisPayload = JSON.stringify({
      merchant: merchantName,
      amount: amount,
      timestamp: Date.now(),
      type: "QRIS_STATIC"
    })

    QRCode.toDataURL(qrisPayload, {
      width: 280,
      margin: 2,
      color: {
        dark: "#1a1a1a",
        light: "#ffffff"
      }
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error("QR generation error:", err))
  }, [merchantName, amount])

  return (
    <div className="flex flex-col items-center">
      {/* QR Code */}
      <div className="bg-white p-4 rounded-2xl shadow-lg border border-stone-200">
        {qrDataUrl ? (
          <img 
            src={qrDataUrl} 
            alt="QRIS Code" 
            className="w-[200px] h-[200px] md:w-[250px] md:h-[250px]"
          />
        ) : (
          <div className="w-[200px] h-[200px] md:w-[250px] md:h-[250px] bg-stone-100 animate-pulse rounded-xl" />
        )}
      </div>

      {/* QRIS Label */}
      <div className="mt-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Logo_QRIS.svg/320px-Logo_QRIS.svg.png" 
            alt="QRIS" 
            className="h-6 object-contain"
          />
        </div>
        <p className="text-sm text-stone-500">Scan dengan aplikasi e-wallet</p>
        <p className="text-xs text-stone-400 mt-1">GoPay, OVO, DANA, ShopeePay, dll</p>
      </div>
    </div>
  )
}
