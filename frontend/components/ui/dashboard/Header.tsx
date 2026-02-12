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
      <Button variant="outline" onClick={onLogout} className="group overflow-hidden relative">
        <LogOut className="mr-2 h-4 w-4 transition-all duration-300 group-hover:translate-x-8 group-hover:opacity-0" />
        <LogOut className="mr-2 h-4 w-4 absolute left-2 transition-all duration-300 -translate-x-8 opacity-0 group-hover:translate-x-0 group-hover:opacity-100" />
      </Button>
    </div>
  )
}