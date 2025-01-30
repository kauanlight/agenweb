import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const data = [
  {
    id: 1,
    date: "2024-01-20",
    totalChats: 156,
    avgResponseTime: "1.8s",
    satisfaction: "98%",
    accuracy: "95%",
  },
  {
    id: 2,
    date: "2024-01-19",
    totalChats: 142,
    avgResponseTime: "2.1s",
    satisfaction: "97%",
    accuracy: "94%",
  },
  {
    id: 3,
    date: "2024-01-18",
    totalChats: 168,
    avgResponseTime: "1.9s",
    satisfaction: "99%",
    accuracy: "96%",
  },
  {
    id: 4,
    date: "2024-01-17",
    totalChats: 134,
    avgResponseTime: "2.0s",
    satisfaction: "98%",
    accuracy: "95%",
  },
]

export function AnalyticsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Métricas Detalhadas</CardTitle>
        <CardDescription>
          Análise diária do desempenho do assistente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Total de Chats</TableHead>
              <TableHead>Tempo Médio</TableHead>
              <TableHead>Satisfação</TableHead>
              <TableHead>Precisão</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.totalChats}</TableCell>
                <TableCell>{row.avgResponseTime}</TableCell>
                <TableCell>{row.satisfaction}</TableCell>
                <TableCell>{row.accuracy}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
