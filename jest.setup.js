import '@testing-library/jest-dom'

// Configurações globais de mock
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    return <img {...props} />
  }
}))

// Mock de APIs do navegador
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn()
  }))
})

// Mock de funções globais
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn()
}

// Limpar mocks após cada teste
afterEach(() => {
  jest.clearAllMocks()
})

// Configurações de timeout
jest.setTimeout(10000)  // 10 segundos para testes assíncronos
