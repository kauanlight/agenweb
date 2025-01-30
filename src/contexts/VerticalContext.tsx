'use client'

import React, { 
  createContext, 
  useState, 
  useContext, 
  ReactNode, 
  useCallback,
  useEffect,
  useMemo
} from 'react'

export type VerticalType = 'healthcare' | 'ecommerce' | null

interface VerticalContextType {
  currentVertical: VerticalType
  selectVertical: (vertical: VerticalType) => void
  isOnboardingComplete: boolean
  completeOnboarding: () => void
  availableVerticals: VerticalType[]
  switchVertical: (vertical: VerticalType) => void
}

const VerticalContext = createContext<VerticalContextType | undefined>(undefined)

export const VerticalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentVertical, setCurrentVertical] = useState<VerticalType>('healthcare')
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false)
  const [availableVerticals, setAvailableVerticals] = useState<VerticalType[]>(['healthcare', 'ecommerce'])

  // Use effect to sync with localStorage
  useEffect(() => {
    const storedVertical = localStorage.getItem('assistpro_current_vertical') as VerticalType
    const storedOnboardingStatus = localStorage.getItem('assistpro_onboarding_complete') === 'true'
    const storedAvailableVerticals = JSON.parse(
      localStorage.getItem('assistpro_available_verticals') || '[]'
    ) as VerticalType[]

    if (storedVertical) setCurrentVertical(storedVertical)
    if (storedOnboardingStatus) setIsOnboardingComplete(storedOnboardingStatus)
    if (storedAvailableVerticals.length > 0) setAvailableVerticals(storedAvailableVerticals)
  }, [])

  // Use effect to update localStorage
  useEffect(() => {
    localStorage.setItem('assistpro_current_vertical', currentVertical || '')
    localStorage.setItem('assistpro_onboarding_complete', String(isOnboardingComplete))
    localStorage.setItem('assistpro_available_verticals', JSON.stringify(availableVerticals))
  }, [currentVertical, isOnboardingComplete, availableVerticals])

  const selectVertical = useCallback((vertical: VerticalType) => {
    if (vertical) {
      setCurrentVertical(vertical)
      
      setAvailableVerticals(prev => {
        const updatedVerticals = prev.includes(vertical) 
          ? prev 
          : [...prev, vertical]
        
        return updatedVerticals
      })

      setIsOnboardingComplete(true)
    }
  }, [])

  const switchVertical = useCallback((vertical: VerticalType) => {
    if (vertical && availableVerticals.includes(vertical)) {
      setCurrentVertical(vertical)
    }
  }, [availableVerticals])

  const completeOnboarding = useCallback(() => {
    setIsOnboardingComplete(true)
  }, [])

  const contextValue = useMemo(() => ({
    currentVertical, 
    selectVertical, 
    isOnboardingComplete,
    completeOnboarding,
    availableVerticals,
    switchVertical
  }), [
    currentVertical, 
    selectVertical, 
    isOnboardingComplete,
    completeOnboarding,
    availableVerticals,
    switchVertical
  ])

  return (
    <VerticalContext.Provider value={contextValue}>
      {children}
    </VerticalContext.Provider>
  )
}

export const useVertical = () => {
  const context = useContext(VerticalContext)
  if (context === undefined) {
    throw new Error('useVertical must be used within a VerticalProvider')
  }
  return context
}
