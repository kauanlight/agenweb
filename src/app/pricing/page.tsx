import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const plans = [
  {
    name: "Starter",
    price: "R$ 97/mês",
    description: "Perfeito para pequenas empresas começando com IA",
    features: [
      "1 Assistente Virtual",
      "Até 500 mensagens/mês",
      "Treinamento básico de IA",
      "Suporte por email",
      "Integração com WhatsApp",
      "Análise básica de métricas",
    ],
    cta: "Começar Grátis",
    popular: false,
  },
  {
    name: "Professional",
    price: "R$ 197/mês",
    description: "Ideal para empresas em crescimento",
    features: [
      "3 Assistentes Virtuais",
      "Até 2000 mensagens/mês",
      "Treinamento avançado de IA",
      "Suporte prioritário",
      "Integração com WhatsApp e Telegram",
      "Analytics completo",
      "Personalização avançada",
      "Base de conhecimento ilimitada",
    ],
    cta: "Escolher Professional",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "R$ 497/mês",
    description: "Para grandes empresas que precisam de escala",
    features: [
      "10 Assistentes Virtuais",
      "Mensagens ilimitadas",
      "Treinamento personalizado de IA",
      "Suporte 24/7",
      "Todas as integrações",
      "Analytics avançado",
      "API personalizada",
      "Onboarding dedicado",
      "SLA garantido",
    ],
    cta: "Falar com Vendas",
    popular: false,
  },
]

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="container flex flex-col gap-6 py-8 md:max-w-[64rem] md:py-12 lg:py-24">
          <div className="mx-auto flex w-full flex-col gap-4 md:max-w-[58rem]">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
              Preços simples e transparentes
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Escolha o plano perfeito para sua empresa. Todos os planos incluem 14 dias de teste grátis.
            </p>
          </div>

          <div className="grid w-full gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`flex flex-col justify-between p-6 ${
                  plan.popular ? "border-2 border-primary shadow-lg" : ""
                }`}
              >
                <div>
                  {plan.popular && (
                    <div className="inline-block rounded-full bg-primary px-3 py-1 text-sm text-primary-foreground">
                      Mais Popular
                    </div>
                  )}
                  <div className="mt-4">
                    <h3 className="font-heading text-2xl">{plan.name}</h3>
                    <p className="mt-2 text-lg font-bold">{plan.price}</p>
                    <p className="mt-2 text-muted-foreground">
                      {plan.description}
                    </p>
                  </div>

                  <ul className="mt-6 space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  className="mt-6 w-full"
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </Card>
            ))}
          </div>
        </section>

        <section className="container flex flex-col gap-6 py-8 md:max-w-[64rem] md:py-12 lg:py-24">
          <div className="mx-auto flex w-full flex-col gap-4 md:max-w-[58rem]">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
              Como funciona
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Crie seu assistente virtual em 4 passos simples
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "1. Importe os Dados",
                description:
                  "Carregue documentos, FAQs ou qualquer conteúdo que seu assistente precisa conhecer",
              },
              {
                title: "2. Personalize o Agente",
                description:
                  "Configure a personalidade, tom de voz e comportamento do seu assistente",
              },
              {
                title: "3. Publique seu Agente",
                description:
                  "Integre com seus canais de atendimento preferidos em poucos cliques",
              },
              {
                title: "4. Monitore as Conversas",
                description:
                  "Acompanhe o desempenho e otimize seu assistente continuamente",
              },
            ].map((step) => (
              <Card key={step.title} className="p-6">
                <h3 className="font-heading text-xl">{step.title}</h3>
                <p className="mt-2 text-muted-foreground">{step.description}</p>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
