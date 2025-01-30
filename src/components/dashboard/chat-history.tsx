import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, ArrowRight } from "lucide-react"

const conversations = [
  {
    id: 1,
    title: "Dúvida sobre instalação",
    preview: "Como faço para instalar o produto no Windows 11?",
    date: "Hoje, 14:30",
    messages: 12,
  },
  {
    id: 2,
    title: "Problemas com login",
    preview: "Não consigo acessar minha conta...",
    date: "Ontem, 16:45",
    messages: 8,
  },
  {
    id: 3,
    title: "Integração API",
    preview: "Qual é a documentação para integrar...",
    date: "19 Jan, 09:15",
    messages: 15,
  },
]

export function ChatHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversas Recentes</CardTitle>
        <CardDescription>
          Você tem {conversations.length} conversas ativas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="space-y-1">
                <h3 className="font-medium">{conv.title}</h3>
                <p className="text-sm text-muted-foreground">{conv.preview}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{conv.date}</span>
                  <span>•</span>
                  <span className="flex items-center">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    {conv.messages} mensagens
                  </span>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
