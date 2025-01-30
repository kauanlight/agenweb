import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Home from '@/app/page'

describe('Landing Page', () => {
  it('renders main headline', () => {
    render(<Home />)
    const headline = screen.getByText(/Revolucione seu Atendimento com Inteligência Artificial/i)
    expect(headline).toBeInTheDocument()
  })

  it('has "Iniciar Gratuitamente" button', () => {
    render(<Home />)
    const startButton = screen.getByText(/Iniciar Gratuitamente/i)
    expect(startButton).toBeInTheDocument()
    expect(startButton).toHaveAttribute('href', '/comece-agora')
  })

  it('has "Agendar Demo" button', () => {
    render(<Home />)
    const demoButton = screen.getByText(/Agendar Demo/i)
    expect(demoButton).toBeInTheDocument()
    expect(demoButton).toHaveAttribute('href', '/demo')
  })
})
