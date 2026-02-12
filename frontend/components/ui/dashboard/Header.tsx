"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

interface HeaderProps {
  email: string
  onLogout: () => void
}

export default function Header({ email, onLogout }: HeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-1xl font-bold">Personal</h1>
        <p className="text-muted-foreground">{email}</p>
      </div>
      <Button variant="outline" onClick={onLogout}>
        <LogOut className="mr-2 h-4 w-4" />
      </Button>
    </div>
  )
}