import { useEffect } from 'react'
import * as Sentry from "@sentry/nextjs"
import posthog from 'posthog-js'

export const initAnalytics = () => {
  // Configuração do Sentry para monitoramento de erros
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 1.0,
    debug: process.env.NODE_ENV === 'development',
  })

  // Configuração do PostHog para analytics
  if (typeof window !== 'undefined') {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      loaded: (posthog) => {
        // Capturar eventos de página
        posthog.capture('page_view')
      }
    })
  }
}

// Hook para rastrear eventos personalizados
export const useTrackEvent = (eventName: string, properties?: any) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      posthog.capture(eventName, properties)
    }
  }, [eventName, properties])
}

// Função para rastrear conversões
export const trackConversion = (conversionType: string) => {
  posthog.capture('conversion', { type: conversionType })
  Sentry.captureMessage(`Conversão: ${conversionType}`)
}
