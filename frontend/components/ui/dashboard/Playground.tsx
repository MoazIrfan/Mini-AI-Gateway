"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Send } from "lucide-react"

interface PlaygroundProps {
  model: string
  prompt: string
  response: string
  loading: boolean
  error: string
  onModelChange: (value: string) => void
  onPromptChange: (value: string) => void
  onSendPrompt: () => void
}

export default function Playground({
  model,
  prompt,
  response,
  loading,
  error,
  onModelChange,
  onPromptChange,
  onSendPrompt,
}: PlaygroundProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Playground</CardTitle>
        <CardDescription>Test your AI endpoint</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Model</label>
          <Select value={model} onValueChange={onModelChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4">GPT-4</SelectItem>
              <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
              <SelectItem value="claude-3">Claude 3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Prompt</label>
          <Textarea
            placeholder="Enter your prompt here..."
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            rows={4}
          />
        </div>

        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {response && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Response</label>
            <div className="rounded-md border bg-muted p-4">
              <p className="text-sm">{response}</p>
            </div>
          </div>
        )}

        <Button onClick={onSendPrompt} disabled={loading || !prompt}>
          <Send className="mr-2 h-4 w-4" />
          {loading ? "Sending..." : "Send"}
        </Button>
      </CardContent>
    </Card>
  )
}