'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { openaiService } from '@/lib/llm/openai-service'

export function OpenAIStatus() {
  const [apiStatus, setApiStatus] = useState<{
    isConfigured: boolean
    organization?: string
    project?: string
  }>({ isConfigured: false })

  useEffect(() => {
    async function checkStatus() {
      const status = await openaiService.checkAPIStatus()
      setApiStatus(status)
    }

    checkStatus()
  }, [])

  if (apiStatus.isConfigured) {
    return (
      <Badge variant="success" className="flex items-center gap-2">
        <span>✅ OpenAI Conectado</span>
        {apiStatus.organization && (
          <span className="text-xs opacity-70">
            Org: {apiStatus.organization}
          </span>
        )}
        {apiStatus.project && (
          <span className="text-xs opacity-70">
            Proj: {apiStatus.project}
          </span>
        )}
      </Badge>
    )
  }

  return (
    <Badge variant="warning" className="flex items-center gap-2">
      ⚠️ OpenAI não configurado
    </Badge>
  )
}
