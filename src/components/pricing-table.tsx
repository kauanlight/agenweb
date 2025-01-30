"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Starter",
    price: "R$ 297",
    description: "Perfeito para pequenas empresas começando com IA",
    features: [
      "5.000 mensagens por mês",
      "1 assistente virtual",
      "Base de conhecimento até 500 páginas",
      "Suporte por email",
      "Integrações básicas (WhatsApp, Telegram)",
      "Análise de métricas básicas",
      "Personalização básica do assistente",
      "Exportação de dados"
    ],
  },
  {
    name: "Professional",
    price: "R$ 797",
    description: "Ideal para empresas em crescimento",
    features: [
      "25.000 mensagens por mês",
      "3 assistentes virtuais",
      "Base de conhecimento até 2.000 páginas",
      "Suporte prioritário",
      "Todas as integrações (+ Slack, Discord, API)",
      "Análise avançada de métricas",
      "Personalização completa do assistente",
      "Treinamento incluído"
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Sob consulta",
    description: "Para grandes empresas com necessidades específicas",
    features: [
      "Mensagens ilimitadas",
      "Assistentes ilimitados",
      "Base de conhecimento ilimitada",
      "Suporte 24/7 dedicado",
      "Integrações customizadas",
      "Análise de métricas em tempo real",
      "Treinamento personalizado",
      "Infraestrutura dedicada"
    ],
  },
]

export function PricingTable() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
      {plans.map((plan) => (
        <Card
          key={plan.name}
          className={`relative ${
            plan.popular
              ? "border-primary shadow-lg shadow-primary/10"
              : "border-border"
          }`}
        >
          {plan.popular && (
            <Badge
              variant="default"
              className="absolute -top-3 left-0 right-0 mx-auto w-fit"
            >
              Mais Popular
            </Badge>
          )}
          <CardHeader>
            <CardTitle className="text-2xl">{plan.name}</CardTitle>
            <CardDescription className="pt-1.5 text-xl font-bold">
              {plan.price}
              {plan.price !== "Sob consulta" && <span className="text-sm font-normal text-muted-foreground">/mês</span>}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <p className="text-sm text-muted-foreground">
              {plan.description}
            </p>
            <ul className="grid gap-2.5 text-sm">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              variant={plan.popular ? "default" : "outline"}
            >
              {plan.name === "Enterprise" ? "Fale Conosco" : "Começar Agora"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
