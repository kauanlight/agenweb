'use client'

import { useState, useCallback } from 'react'
import { 
  ShoppingCart, 
  Package, 
  Truck, 
  RefreshCw, 
  MessageCircle, 
  AlertCircle 
} from '@/lib/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Order {
  id: string
  customerName: string
  products: {
    name: string
    quantity: number
    price: number
  }[]
  total: number
  status: 'processing' | 'shipped' | 'delivered' | 'returned'
  trackingNumber?: string
  shippingMethod: 'standard' | 'express' | 'overnight'
}

interface CustomerSupport {
  id: string
  orderId: string
  customerName: string
  issue: 'delivery' | 'product' | 'refund'
  status: 'open' | 'in-progress' | 'resolved'
  messages: {
    sender: 'customer' | 'support'
    text: string
    timestamp: string
  }[]
}

console.log('EcommerceAssistant module loaded');

export default function EcommerceAssistant() {
  console.log('EcommerceAssistant function called');
  console.log('Current environment:', typeof window !== 'undefined' ? 'Client' : 'Server');

  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      customerName: 'João Silva',
      products: [
        { name: 'Smartphone X', quantity: 1, price: 1999.99 },
        { name: 'Carregador', quantity: 2, price: 49.99 }
      ],
      total: 2099.97,
      status: 'processing',
      shippingMethod: 'express'
    }
  ])

  const [customerSupport, setCustomerSupport] = useState<CustomerSupport[]>([
    {
      id: '1',
      orderId: '1',
      customerName: 'Maria Souza',
      issue: 'delivery',
      status: 'open',
      messages: [
        { 
          sender: 'customer', 
          text: 'Meu pedido está atrasado', 
          timestamp: new Date().toISOString() 
        }
      ]
    }
  ])

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [selectedSupport, setSelectedSupport] = useState<CustomerSupport | null>(null)

  const handleOrderDetails = useCallback((order: Order) => {
    setSelectedOrder(order)
  }, [])

  const handleSupportDetails = useCallback((support: CustomerSupport) => {
    setSelectedSupport(support)
  }, [])

  const renderOrdersList = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShoppingCart className="mr-2" /> Pedidos
        </CardTitle>
      </CardHeader>
      <CardContent>
        {orders.map(order => (
          <div 
            key={order.id} 
            className="flex justify-between items-center p-2 border-b hover:bg-gray-100 cursor-pointer"
            onClick={() => handleOrderDetails(order)}
          >
            <div>
              <span className="font-bold">{order.customerName}</span>
              <Badge variant={order.status === 'processing' ? 'default' : 'outline'} className="ml-2">
                {order.status}
              </Badge>
            </div>
            <span>R$ {order.total.toFixed(2)}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )

  const renderCustomerSupportList = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageCircle className="mr-2" /> Suporte ao Cliente
        </CardTitle>
      </CardHeader>
      <CardContent>
        {customerSupport.map(support => (
          <div 
            key={support.id} 
            className="flex justify-between items-center p-2 border-b hover:bg-gray-100 cursor-pointer"
            onClick={() => handleSupportDetails(support)}
          >
            <div>
              <span className="font-bold">{support.customerName}</span>
              <Badge variant={support.status === 'open' ? 'destructive' : 'outline'} className="ml-2">
                {support.status}
              </Badge>
            </div>
            <span>{support.issue}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )

  const renderOrderDetailsModal = () => {
    if (!selectedOrder) return null

    return (
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Pedido</DialogTitle>
            <DialogDescription>
              Informações detalhadas sobre o pedido de {selectedOrder.customerName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Status:</span>
              <Badge>{selectedOrder.status}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Método de Envio:</span>
              <span>{selectedOrder.shippingMethod}</span>
            </div>
            <div>
              <h3 className="font-bold mb-2">Produtos</h3>
              {selectedOrder.products.map((product, index) => (
                <div key={index} className="flex justify-between">
                  <span>{product.name}</span>
                  <span>
                    {product.quantity} x R$ {product.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>R$ {selectedOrder.total.toFixed(2)}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const renderSupportDetailsModal = () => {
    if (!selectedSupport) return null

    return (
      <Dialog open={!!selectedSupport} onOpenChange={() => setSelectedSupport(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Suporte</DialogTitle>
            <DialogDescription>
              Conversa com {selectedSupport.customerName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Pedido:</span>
              <span>{selectedSupport.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <Badge>{selectedSupport.status}</Badge>
            </div>
            <div>
              <h3 className="font-bold mb-2">Histórico de Mensagens</h3>
              {selectedSupport.messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`p-2 rounded-lg mb-2 ${
                    message.sender === 'customer' 
                      ? 'bg-gray-100 text-right' 
                      : 'bg-blue-100 text-left'
                  }`}
                >
                  <p>{message.text}</p>
                  <small className="text-xs text-gray-500">
                    {new Date(message.timestamp).toLocaleString()}
                  </small>
                </div>
              ))}
            </div>
            <Input placeholder="Responder cliente" className="mt-4" />
            <Button className="w-full">Enviar Resposta</Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Assistente de E-commerce</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderOrdersList()}
        {renderCustomerSupportList()}
      </div>

      {renderOrderDetailsModal()}
      {renderSupportDetailsModal()}
    </div>
  )
}
