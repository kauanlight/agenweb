import { useTranslations } from 'next-intl'
import MainNavigation from '@/components/main-nav'
import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  const t = useTranslations('Landing')

  return (
    <div className="min-h-screen">
      <MainNavigation />
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-24">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 max-w-3xl mx-auto">
            {t('title')}
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
          <Link 
            href="/dashboard" 
            className={buttonVariants({ 
              variant: 'default', 
              size: 'lg' 
            })}
          >
            {t('cta')}
          </Link>
        </div>
      </section>
    </div>
  )
}
