import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  title: string
  userName?: string
}

export function Header({ title, userName = "User" }: HeaderProps) {
  return (
    <header className="h-16 border-b bg-white px-6 flex items-center justify-between">
      <h2 className="text-xl font-semibold">{title}</h2>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{userName}</span>
        </div>
      </div>
    </header>
  )
}