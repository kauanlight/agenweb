import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '../dialog'

describe('Dialog Component', () => {
  test('renders dialog content when open', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
            <DialogDescription>Dialog description</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )

    // Verificar título e descrição
    expect(screen.getByText('Test Dialog')).toBeInTheDocument()
    expect(screen.getByText('Dialog description')).toBeInTheDocument()
  })

  test('dialog can be closed', () => {
    const onOpenChange = jest.fn()

    render(
      <Dialog open onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Closeable Dialog</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )

    // Encontrar e clicar no botão de fechar
    const closeButton = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeButton)

    // Verificar se o callback de mudança foi chamado
    expect(onOpenChange).toHaveBeenCalled()
  })

  test('dialog is accessible', () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accessible Dialog</DialogTitle>
            <DialogDescription>Dialog for testing accessibility</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )

    // Verificar elementos de acessibilidade
    const triggerButton = screen.getByText('Open Dialog')
    expect(triggerButton).toHaveAttribute('aria-haspopup', 'dialog')
  })

  test('dialog responsiveness', () => {
    const { container } = render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Responsive Dialog</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )

    const dialogContent = container.querySelector('[data-radix-dialog-content]')
    
    // Verificar classes de responsividade
    expect(dialogContent).toHaveClass('md:w-full')
    expect(dialogContent).toHaveClass('max-w-lg')
  })
})
