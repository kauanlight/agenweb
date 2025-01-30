import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { pricingCards } from "@/lib/constants"
import { Check } from "lucide-react"
import Link from "next/link"

export default function PrecosPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Planos AssistPro AI
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Escolha o plano perfeito para sua empresa
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pricingCards.map((plan, index) => (
            <Card 
              key={plan.title}
              className={`
                w-full flex flex-col justify-between 
                ${index === 1 ? 'border-2 border-primary shadow-lg' : ''}
              `}
            >
              <CardHeader>
                <CardTitle 
                  className={`
                    text-2xl font-bold 
                    ${index === 1 ? 'text-primary' : 'text-gray-800'}
                  `}
                >
                  {plan.title}
                </CardTitle>
                <CardDescription>
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="text-4xl font-bold text-gray-900 mb-4">
                  R$ {plan.price}
                  <span className="text-base text-gray-500 ml-2">
                    /mês
                  </span>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li 
                      key={feature} 
                      className="flex items-center text-gray-700"
                    >
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Link 
                  href="/contato" 
                  className="w-full"
                >
                  <Button 
                    variant={index === 1 ? "default" : "outline"} 
                    className="w-full"
                  >
                    {index === 1 
                      ? "Escolher Plano Pro" 
                      : "Selecionar Plano"}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12 text-gray-600">
          <p>
            Precisa de um plano personalizado? 
            <Link 
              href="/contato" 
              className="ml-1 text-primary hover:underline"
            >
              Fale conosco
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
