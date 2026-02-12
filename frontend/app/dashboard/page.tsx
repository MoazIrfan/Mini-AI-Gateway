"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/dashboard/Header"
import { CreditsCard } from "@/components/dashboard/CreditsCard"
import { ApiKeyManager } from "@/components/dashboard/ApiKeyManager"
import { Playground } from "@/components/dashboard/Playground"
import { RequestLogs } from "@/components/dashboard/RequestLogs"

const API_URL = process.env.NEXT_PUBLIC_API_URL

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

    const savedApiKey = localStorage.getItem("currentApiKey")
    if (savedApiKey) {
      setApiKey(savedApiKey)
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
        localStorage.setItem("currentApiKey", data.apiKey)
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
    if (!apiKey) {
      setError("Please generate a new API key to make requests.")
      return
    }

    setLoading(true)
    setError("")
    setResponse("")

    try {
      const res = await fetch(`${API_URL}/v1/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
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
      
      if (user) {
        setUser({ ...user, credits: data.credits_remaining })
      }
      
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
    localStorage.removeItem("currentApiKey")
    router.push("/login")
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
        <Header user={user} onLogout={handleLogout} />
        
        <CreditsCard credits={user.credits} />
        
        <ApiKeyManager
          hasKey={hasKey}
          maskedKey={maskedKey}
          apiKey={apiKey}
          onGenerate={generateApiKey}
          onCopy={copyToClipboard}
        />
        
        <Playground
          model={model}
          prompt={prompt}
          response={response}
          error={error}
          loading={loading}
          onModelChange={setModel}
          onPromptChange={setPrompt}
          onSend={handleSendPrompt}
        />
        
        <RequestLogs logs={logs} />
      </div>
    </div>
  )
}