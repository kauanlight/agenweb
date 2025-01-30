export const siteConfig = {
  name: "AssistPro AI",
  description: "Assistente de IA para atendimento inteligente",
  links: {
    github: "https://github.com/seu-usuario/assistpro-ai",
    twitter: "https://twitter.com/assistproai",
    discord: "https://discord.gg/assistpro"
  },
  mainNav: [
    {
      title: "Dashboard",
      href: "/dashboard",
    },
    {
      title: "Preços",
      href: "/pricing",
    },
    {
      title: "Voz",
      href: "/voice",
    }
  ],
  features: {
    voiceAssistant: {
      enabled: true,
      languages: ["pt-BR", "en-US"],
      providers: ["google", "azure"]
    }
  }
}
