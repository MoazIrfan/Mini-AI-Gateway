"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Copy, Key, LogOut, Send } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface User {
  id: string
  email: string
  credits: number
}

interface Log {
  id: string
  model: string
  promptLength: number
  cost: number
  status: string
  timestamp: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [apiKey, setApiKey] = useState<string>("")
  const [maskedKey, setMaskedKey] = useState<string>("")
  const [hasKey, setHasKey] = useState(false)
  
  // Playground state
  const [model, setModel] = useState("gpt-4")
  const [prompt, setPrompt] = useState("")
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
  // Logs state
  const [logs, setLogs] = useState<Log[]>([])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    fetchUserData()
    fetchApiKey()
    fetchLogs()
  }, [])

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/api/logs/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (data.user) {
        setUser(data.user)
      }
    } catch (err) {
      console.error("Failed to fetch user data:", err)
    }
  }

  const fetchApiKey = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/api/keys/current`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      setHasKey(data.hasKey)
      setMaskedKey(data.maskedKey || "")
    } catch (err) {
      console.error("Failed to fetch API key:", err)
    }
  }

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/api/logs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      setLogs(data.logs || [])
    } catch (err) {
      console.error("Failed to fetch logs:", err)
    }
  }

  const generateApiKey = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/api/keys/generate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      
      if (data.apiKey) {
        setApiKey(data.apiKey)
        setMaskedKey(data.maskedKey)
        setHasKey(true)
        alert(`API Key generated! Copy it now:\n\n${data.apiKey}\n\nYou won't be able to see it again.`)
      }
    } catch (err) {
      console.error("Failed to generate API key:", err)
      alert("Failed to generate API key")
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("Copied to clipboard!")
  }

  const handleSendPrompt = async () => {
    if (!apiKey && !hasKey) {
      setError("Please generate an API key first")
      return
    }

    setLoading(true)
    setError("")
    setResponse("")

    try {
      const keyToUse = apiKey || maskedKey
      const res = await fetch(`${API_URL}/v1/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${keyToUse}`,
        },
        body: JSON.stringify({ model, prompt }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Request failed")
        setLoading(false)
        return
      }

      setResponse(data.reply)
      
      // Update credits
      if (user) {
        setUser({ ...user, credits: data.credits_remaining })
      }
      
      // Refresh logs
      fetchLogs()
    } catch (err) {
      setError("Failed to send request")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">AI Gateway Dashboard</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Credits Card */}
        <Card>
          <CardHeader>
            <CardTitle>Credits Balance</CardTitle>
            <CardDescription>Each AI request costs 5 credits</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{user.credits}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {Math.floor(user.credits / 5)} requests remaining
            </p>
          </CardContent>
        </Card>

        {/* API Key Management */}
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
                    onClick={() => copyToClipboard(apiKey || maskedKey)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <Button onClick={generateApiKey} variant="destructive">
                  <Key className="mr-2 h-4 w-4" />
                  Regenerate API Key
                </Button>
                <p className="text-xs text-muted-foreground">
                  ⚠️ Regenerating will invalidate your current key
                </p>
              </div>
            ) : (
              <Button onClick={generateApiKey}>
                <Key className="mr-2 h-4 w-4" />
                Generate API Key
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Playground */}
        <Card>
          <CardHeader>
            <CardTitle>Playground</CardTitle>
            <CardDescription>Test your AI endpoint</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Model</label>
              <Select value={model} onValueChange={setModel}>
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
                onChange={(e) => setPrompt(e.target.value)}
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

            <Button onClick={handleSendPrompt} disabled={loading || !prompt}>
              <Send className="mr-2 h-4 w-4" />
              {loading ? "Sending..." : "Send Request"}
            </Button>
          </CardContent>
        </Card>

        {/* Request Logs */}
        <Card>
          <CardHeader>
            <CardTitle>Request Logs</CardTitle>
            <CardDescription>Your last 10 API requests</CardDescription>
          </CardHeader>
          <CardContent>
            {logs.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No requests yet. Try the playground above!
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Prompt Length</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.slice(0, 10).map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-xs">
                        {formatDate(log.timestamp)}
                      </TableCell>
                      <TableCell>{log.model}</TableCell>
                      <TableCell>{log.promptLength} chars</TableCell>
                      <TableCell>{log.cost} credits</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            log.status === "success"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {log.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}