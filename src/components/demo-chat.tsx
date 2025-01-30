"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  SendIcon, 
  MicIcon, 
  StopCircleIcon, 
  RefreshCwIcon 
} from 'lucide-react'

type Message = {
  id: number
  text: string
  sender: 'user' | 'ai'
}

const demoMessages: Message[] = [
  { 
    id: 1, 
    text: "Olá! Como posso ajudar você hoje?", 
    sender: 'ai' 
  },
  { 
    id: 2, 
    text: "Quero informações sobre um pedido.", 
    sender: 'user' 
  },
  { 
    id: 3, 
    text: "Claro! Pode me fornecer o número do pedido?", 
    sender: 'ai' 
  }
]

export function DemoChat() {
  const [messages, setMessages] = useState<Message[]>([demoMessages[0]])
  const [input, setInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const addMessage = (text: string, sender: 'user' | 'ai') => {
    const newMessage: Message = {
      id: messages.length + 1,
      text,
      sender
    }
    setMessages(prev => [...prev, newMessage])
  }

  const handleSendMessage = () => {
    if (input.trim()) {
      addMessage(input, 'user')
      setInput('')
      
      // Simular resposta da IA
      setTimeout(() => {
        const aiResponse = demoMessages[2].text
        addMessage(aiResponse, 'ai')
      }, 1000)
    }
  }

  const handleVoiceRecording = () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      // Lógica de gravação de voz
      setTimeout(() => {
        addMessage("Pedido #12345", 'user')
        setIsRecording(false)
      }, 2000)
    }
  }

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-primary p-4 text-white flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <RefreshCwIcon className="animate-spin-slow" size={20} />
          <span>AgenWeb Demo</span>
        </div>
      </div>

      {/* Mensagens */}
      <div className="flex-grow overflow-y-auto p-4 space-y-3">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div 
                className={`
                  max-w-[70%] p-3 rounded-lg 
                  ${msg.sender === 'user' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-200 text-gray-800'
                  }
                `}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="bg-gray-100 p-4 flex items-center space-x-2">
        <motion.div 
          className="flex-grow"
          whileFocus={{ scale: 1.02 }}
        >
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="w-full p-2 rounded-lg border focus:ring-2 focus:ring-primary"
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
        </motion.div>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleSendMessage}
          className="bg-primary text-white p-2 rounded-full"
        >
          <SendIcon />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleVoiceRecording}
          className={`
            p-2 rounded-full 
            ${isRecording 
              ? 'bg-red-500 text-white animate-pulse' 
              : 'bg-secondary text-primary'
            }
          `}
        >
          {isRecording ? <StopCircleIcon /> : <MicIcon />}
        </motion.button>
      </div>
    </div>
  )
}
