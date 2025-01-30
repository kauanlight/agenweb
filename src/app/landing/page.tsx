"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { 
  PlayCircleIcon, 
  RocketIcon, 
  TargetIcon, 
  CodeIcon, 
  HeartPulseIcon, 
  BookOpenIcon,
  ClockIcon,
  MessageCircleIcon,
  TrendingUpIcon,
  Quote,
  MessageCircleIcon as MessageCircleIcon2,
  GlobeIcon,
  BarChartIcon,
  ShieldIcon,
  RepeatIcon,
  DatabaseIcon
} from "lucide-react"
import { DemoChat } from "@/components/demo-chat"
import Image from "next/image"

export default function AgenWebLandingPage() {
  const features = [
    { 
      title: "Automação Inteligente", 
      description: "Reduza até 50% do tempo de atendimento com IA.",
      icon: ClockIcon,
      color: "text-blue-500"
    },
    { 
      title: "Sem Complexidade", 
      description: "Configure em minutos, sem conhecimento técnico.",
      icon: CodeIcon,
      color: "text-green-500"
    },
    { 
      title: "Resultados Mensuráveis", 
      description: "Acompanhe métricas em tempo real.",
      icon: TrendingUpIcon,
      color: "text-purple-500"
    },
    { 
      title: "Personalização Total", 
      description: "Adapte o assistente para sua marca.",
      icon: MessageCircleIcon,
      color: "text-pink-500"
    }
  ]

  const useCases = [
    { 
      title: "E-commerce", 
      description: "Reduza filas e responda dúvidas instantaneamente.",
      icon: "/images/ecommerce-icon.svg",
      stats: "+35% Conversão"
    },
    { 
      title: "Suporte Técnico", 
      description: "Resolva problemas 24/7 sem equipe adicional.",
      icon: "/images/support-icon.svg", 
      stats: "-50% Custos"
    },
    { 
      title: "Saúde", 
      description: "Agende consultas e tire dúvidas com segurança.",
      icon: "/images/health-icon.svg",
      stats: "+40% Satisfação"
    },
    { 
      title: "Educação", 
      description: "Suporte instantâneo para alunos e professores.",
      icon: "/images/education-icon.svg",
      stats: "+25% Engajamento"
    }
  ]

  const testimonials = [
    {
      name: "Carlos Silva",
      role: "CEO, E-commerce Brasil",
      quote: "A AgenWeb revolucionou nosso atendimento. Reduzimos em 50% o tempo de resposta e aumentamos a satisfação do cliente.",
      avatar: "/images/testimonial-1.jpg"
    },
    {
      name: "Ana Santos",
      role: "Diretora de Operações, Clínica Médica Premium",
      quote: "Implementar o AgenWeb foi transformador. Nossos pacientes agora têm suporte 24/7 e nossa equipe pode focar em casos mais complexos.",
      avatar: "/images/testimonial-2.jpg"
    },
    {
      name: "João Oliveira",
      role: "Coordenador Acadêmico, Universidade Tech",
      quote: "O assistente de IA mudou completamente nossa comunicação com alunos. Respostas instantâneas e precisas em qualquer horário.",
      avatar: "/images/testimonial-3.jpg"
    }
  ]

  const capabilities = [
    {
      icon: MessageCircleIcon2,
      title: "Atendimento Inteligente",
      description: "Resposta instantânea em múltiplos idiomas, com compreensão contextual avançada.",
      color: "text-blue-500"
    },
    {
      icon: GlobeIcon,
      title: "Integração Multicanal",
      description: "Conecte-se com clientes via WhatsApp, Telegram, Website, E-mail e Redes Sociais.",
      color: "text-green-500"
    },
    {
      icon: BarChartIcon,
      title: "Análise de Performance",
      description: "Métricas em tempo real de satisfação, tempo de resposta e taxa de resolução.",
      color: "text-purple-500"
    },
    {
      icon: ShieldIcon,
      title: "Segurança Avançada",
      description: "Criptografia de ponta a ponta e total conformidade com LGPD e GDPR.",
      color: "text-red-500"
    },
    {
      icon: RepeatIcon,
      title: "Aprendizado Contínuo",
      description: "IA que aprende e se adapta constantemente ao contexto do seu negócio.",
      color: "text-yellow-500"
    },
    {
      icon: DatabaseIcon,
      title: "Integrações Poderosas",
      description: "Conecte facilmente com CRM, Helpdesk, E-commerce e ferramentas de Analytics.",
      color: "text-pink-500"
    }
  ]

  return (
    <div className="font-sans bg-gray-50 text-gray-800">
      {/* Seção Hero */}
      <header className="bg-gradient-primary text-white text-center py-16 md:py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary opacity-70 blur-3xl"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 animate-pulse">
            Atenda Clientes 24/7 e Automatize Processos com Inteligência Artificial
          </h1>
          <p className="text-base md:text-xl mb-6 md:mb-8 max-w-3xl mx-auto">
            Transforme seu atendimento, reduza custos e melhore a satisfação do cliente com nossa solução de IA avançada.
          </p>
          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="default" 
                  className="bg-white text-primary hover:bg-gray-100 group px-6 md:px-8 py-2 md:py-3 text-base md:text-lg"
                >
                  <PlayCircleIcon className="mr-2 group-hover:animate-pulse w-4 h-4 md:w-6 md:h-6" />
                  Teste Gratuitamente por 7 Dias
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Experimente o AgenWeb</DialogTitle>
                  <DialogDescription>
                    Veja como nossa IA pode transformar seu atendimento em minutos
                  </DialogDescription>
                </DialogHeader>
                <div className="w-full">
                  <DemoChat />
                </div>
              </DialogContent>
            </Dialog>
            <Button 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-primary-light px-6 md:px-8 py-2 md:py-3 text-base md:text-lg"
            >
              Ver Demonstração
            </Button>
          </div>
        </div>
      </header>

      {/* Seção Benefícios */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">Por que escolher AgenWeb?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div 
                key={index} 
                className="bg-white shadow-soft rounded-lg p-6 text-center hover:shadow-glow transition-all duration-300 group"
              >
                <Icon 
                  className={`mx-auto mb-4 ${feature.color} group-hover:animate-pulse`} 
                  size={48} 
                  strokeWidth={1.5}
                />
                <h3 className="font-semibold text-xl mb-2 text-primary">
                  {feature.title}
                </h3>
                <p>{feature.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Seção Casos de Uso */}
      <section className="bg-gray-100 py-16 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">Como Resolvemos Problemas Reais</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {useCases.map((useCase, index) => (
            <div 
              key={index} 
              className="bg-white shadow-soft p-6 rounded-lg hover:shadow-glow transition-all duration-300 flex flex-col items-center text-center"
            >
              <Image 
                src={useCase.icon} 
                alt={useCase.title} 
                width={64} 
                height={64} 
                className="mb-4"
              />
              <h3 className="font-semibold text-xl mb-2 text-primary">{useCase.title}</h3>
              <p className="mb-4">{useCase.description}</p>
              <div className="bg-primary/10 text-primary px-4 py-2 rounded-full">
                {useCase.stats}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Seção Depoimentos */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">O Que Nossos Clientes Dizem</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-gray-50 p-6 rounded-lg shadow-soft hover:shadow-glow transition-all duration-300 relative"
              >
                <Quote className="absolute top-4 left-4 text-primary/20 w-12 h-12" />
                <p className="text-lg italic mb-6 text-gray-700">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-primary">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção Funcionalidades */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Funcionalidades que Transformam seu Atendimento</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {capabilities.map((capability, index) => {
              const Icon = capability.icon
              return (
                <div 
                  key={index} 
                  className="bg-white p-6 rounded-lg shadow-soft hover:shadow-glow transition-all duration-300 group"
                >
                  <div className="flex items-center mb-4">
                    <Icon 
                      className={`mr-4 ${capability.color} group-hover:animate-pulse`} 
                      size={48} 
                      strokeWidth={1.5} 
                    />
                    <h3 className="text-xl font-semibold text-primary">
                      {capability.title}
                    </h3>
                  </div>
                  <p className="text-gray-600">{capability.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Seção Final de Call to Action */}
      <section className="bg-gradient-secondary text-white py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Transforme Seu Atendimento Agora</h2>
          <p className="text-xl mb-8">
            Não perca mais tempo com processos manuais. Comece a escalar seu atendimento com inteligência artificial.
          </p>
          <Button 
            variant="default" 
            className="bg-white text-primary hover:bg-gray-100 group px-10 py-4 text-lg"
          >
            <RocketIcon className="mr-2 group-hover:animate-pulse" size={24} />
            Iniciar Demonstração Gratuita
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-8 text-center">
        <p>&copy; 2025 AgenWeb. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}
