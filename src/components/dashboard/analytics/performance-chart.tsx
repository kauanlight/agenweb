import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { date: "Jan 01", messages: 120, responseTime: 2.5 },
  { date: "Jan 02", messages: 150, responseTime: 2.2 },
  { date: "Jan 03", messages: 180, responseTime: 2.0 },
  { date: "Jan 04", messages: 220, responseTime: 1.8 },
  { date: "Jan 05", messages: 250, responseTime: 1.6 },
  { date: "Jan 06", messages: 280, responseTime: 1.5 },
  { date: "Jan 07", messages: 310, responseTime: 1.4 },
]

export function PerformanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance do Assistente</CardTitle>
        <CardDescription>
          Mensagens processadas e tempo médio de resposta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="messages"
                stroke="#2563eb"
                strokeWidth={2}
                name="Mensagens"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="responseTime"
                stroke="#16a34a"
                strokeWidth={2}
                name="Tempo de Resposta (s)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
