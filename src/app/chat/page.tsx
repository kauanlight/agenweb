import { ChatInterface } from "@/components/chat/chat-interface"

export default function ChatPage() {
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto space-y-4 mb-8">
        <h1 className="text-3xl font-bold text-center">AssistPro AI Chat</h1>
        <p className="text-muted-foreground text-center">
          Converse com nosso assistente AI e obtenha respostas rápidas e precisas
        </p>
      </div>
      <ChatInterface />
    </div>
  )
}
