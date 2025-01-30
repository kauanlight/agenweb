# Dashboard Layout Component

## Visão Geral
Este componente implementa o layout padrão do dashboard do AssistPro, seguindo as diretrizes de design e mantendo consistência visual em toda a aplicação.

## Estrutura
O componente é dividido em três partes principais:
- `DashboardLayout`: Componente principal que organiza a estrutura
- `Sidebar`: Menu lateral com navegação
- `MainContent`: Área principal de conteúdo

## Componentes
### DashboardLayout
```tsx
<DashboardLayout>
  {/* Conteúdo do dashboard */}
</DashboardLayout>
```

### Sidebar
- Largura fixa: 250px
- Posição: Fixa à esquerda
- Menu de navegação com links para todas as seções

### MainContent
- Margem à esquerda: 250px (alinhada com a sidebar)
- Conteúdo centralizado com largura máxima de 1200px
- Padding interno de 20px

## Estilos
Os estilos são isolados usando CSS Modules para evitar conflitos:
- `styles.module.css`: Contém todos os estilos específicos do layout
- Responsivo para diferentes tamanhos de tela
- Cores e dimensões padronizadas

## Testes
Os testes automatizados verificam:
- Renderização correta de todos os elementos
- Estrutura do layout
- Responsividade
- Navegação

## Manutenção
1. Todas as alterações devem ser feitas através de Pull Requests
2. Testes devem passar antes do merge
3. Documentação deve ser atualizada junto com as alterações

## Design Original
O design segue o modelo original aprovado, mantendo:
- Esquema de cores
- Tipografia
- Espaçamentos
- Hierarquia visual

## Responsividade
- Desktop: Layout completo com sidebar fixa
- Tablet: Sidebar reduzida (200px)
- Mobile: Layout em coluna com menu no topo
