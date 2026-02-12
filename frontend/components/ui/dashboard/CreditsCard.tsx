"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface CreditsCardProps {
  credits: number
}

export default function CreditsCard({ credits }: CreditsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Credits Balance</CardTitle>
        <CardDescription>Each AI request costs 5 credits</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold">{credits}</p>
        <p className="text-sm text-muted-foreground mt-1">
          {Math.floor(credits / 5)} requests remaining
        </p>
      </CardContent>
    </Card>
  )
}