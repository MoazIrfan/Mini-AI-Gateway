"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Log {
  id: string
  model: string
  promptLength: number
  cost: number
  status: string
  timestamp: string
}

interface RequestLogsProps {
  logs: Log[]
}

export default function RequestLogs({ logs }: RequestLogsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
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
  )
}