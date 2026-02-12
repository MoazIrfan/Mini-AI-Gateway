"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, Key } from "lucide-react"

interface ApiKeyManagerProps {
  hasKey: boolean
  maskedKey: string
  apiKey: string
  onGenerateKey: () => void
  onCopyToClipboard: (text: string) => void
}

export default function ApiKeyManager({
  hasKey,
  maskedKey,
  apiKey,
  onGenerateKey,
  onCopyToClipboard,
}: ApiKeyManagerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>API Key Management</CardTitle>
        <CardDescription>
          Generate an API key to access the AI endpoint
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasKey ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Input value={maskedKey} readOnly className="font-mono" />
              <Button
                variant="outline"
                size="icon"
                onClick={() => onCopyToClipboard(apiKey || maskedKey)}
                disabled={!apiKey}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            {!apiKey && (
              <div className="rounded-md bg-yellow-50 border border-yellow-200 p-3 text-sm text-yellow-800">
                <p className="font-semibold">⚠️ Session Key Required</p>
                <p className="mt-1">You need to regenerate your API key to make requests. The masked key shown above cannot be used for authentication.</p>
              </div>
            )}
            <Button onClick={onGenerateKey} variant="destructive">
              <Key className="mr-2 h-4 w-4" />
              Regenerate API Key
            </Button>
            <p className="text-xs text-muted-foreground">
              ⚠️ Regenerating will invalidate your current key
            </p>
          </div>
        ) : (
          <Button onClick={onGenerateKey}>
            <Key className="mr-2 h-4 w-4" />
            Generate API Key
          </Button>
        )}
      </CardContent>
    </Card>
  )
}