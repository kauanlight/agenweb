import { PerformanceChart } from "@/components/dashboard/analytics/performance-chart"
import { AnalyticsTable } from "@/components/dashboard/analytics/data-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  MessageSquare, 
  Clock, 
  ThumbsUp, 
  Target 
} from "lucide-react"

const overviewMetrics = [
  {
    title: "Total de Conversas",
    value: "2,856",
    change: "+12.5%",
    icon: MessageSquare,
  },
  {
    title: "Tempo Médio de Resposta",
    value: "1.8s",
    change: "-0.3s",
    icon: Clock,
  },
  {
    title: "Satisfação do Cliente",
    value: "98%",
    change: "+2.1%",
    icon: ThumbsUp,
  },
  {
    title: "Precisão das Respostas",
    value: "95%",
    change: "+1.2%",
    icon: Target,
  },
]

export default function AnalyticsPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Análise de Dados</h1>
        <p className="text-muted-foreground">
          Acompanhe o desempenho do seu assistente AI
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {overviewMetrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground">
                  {metric.change} em relação ao mês anterior
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="details">Detalhes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4">
            <PerformanceChart />
          </div>
        </TabsContent>

        <TabsContent value="details">
          <div className="grid gap-4">
            <AnalyticsTable />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
