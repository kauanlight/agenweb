export interface MetricConfig {
  id: string
  title: string
  description: string
  icon: string
  color: string
  calculateValue: (data: any) => number
  calculateChange: (data: any) => string
  generateChartData: (data: any) => any[]
}

export const VERTICAL_METRICS = {
  healthcare: {
    patientResolutionRate: {
      id: 'patient-resolution',
      title: 'Taxa de Resolução de Pacientes',
      description: 'Percentual de consultas resolvidas com sucesso',
      icon: 'stethoscope',
      color: 'text-green-500',
      calculateValue: (data) => {
        const total = data.totalConsultations
        const resolved = data.resolvedConsultations
        return Math.round((resolved / total) * 100)
      },
      calculateChange: (data) => {
        const currentRate = (data.resolvedConsultations / data.totalConsultations) * 100
        const previousRate = (data.previousResolvedConsultations / data.previousTotalConsultations) * 100
        const change = currentRate - previousRate
        return change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`
      },
      generateChartData: (data) => [
        { name: 'Jan', value: data.monthlyResolutionRates[0] },
        { name: 'Fev', value: data.monthlyResolutionRates[1] },
        { name: 'Mar', value: data.monthlyResolutionRates[2] }
      ]
    },
    appointmentVolume: {
      id: 'appointment-volume',
      title: 'Volume de Consultas',
      description: 'Número total de consultas agendadas',
      icon: 'calendar',
      color: 'text-blue-500',
      calculateValue: (data) => data.totalConsultations,
      calculateChange: (data) => {
        const change = ((data.totalConsultations - data.previousTotalConsultations) / data.previousTotalConsultations) * 100
        return change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`
      },
      generateChartData: (data) => [
        { name: 'Jan', value: data.monthlyConsultationVolume[0] },
        { name: 'Fev', value: data.monthlyConsultationVolume[1] },
        { name: 'Mar', value: data.monthlyConsultationVolume[2] }
      ]
    }
  },
  ecommerce: {
    deliveryOnTimeRate: {
      id: 'delivery-time',
      title: 'Taxa de Entregas no Prazo',
      description: 'Percentual de pedidos entregues dentro do prazo',
      icon: 'truck',
      color: 'text-blue-500',
      calculateValue: (data) => {
        const total = data.totalOrders
        const onTime = data.onTimeDeliveries
        return Math.round((onTime / total) * 100)
      },
      calculateChange: (data) => {
        const currentRate = (data.onTimeDeliveries / data.totalOrders) * 100
        const previousRate = (data.previousOnTimeDeliveries / data.previousTotalOrders) * 100
        const change = currentRate - previousRate
        return change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`
      },
      generateChartData: (data) => [
        { name: 'Jan', value: data.monthlyDeliveryRates[0] },
        { name: 'Fev', value: data.monthlyDeliveryRates[1] },
        { name: 'Mar', value: data.monthlyDeliveryRates[2] }
      ]
    },
    orderVolume: {
      id: 'order-volume',
      title: 'Volume de Pedidos',
      description: 'Número total de pedidos processados',
      icon: 'shopping-cart',
      color: 'text-green-500',
      calculateValue: (data) => data.totalOrders,
      calculateChange: (data) => {
        const change = ((data.totalOrders - data.previousTotalOrders) / data.previousTotalOrders) * 100
        return change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`
      },
      generateChartData: (data) => [
        { name: 'Jan', value: data.monthlyOrderVolume[0] },
        { name: 'Fev', value: data.monthlyOrderVolume[1] },
        { name: 'Mar', value: data.monthlyOrderVolume[2] }
      ]
    }
  }
}

export function getVerticalMetrics(vertical: keyof typeof VERTICAL_METRICS) {
  return Object.values(VERTICAL_METRICS[vertical])
}

export function calculateMetricValue(metric: MetricConfig, data: any) {
  return {
    value: metric.calculateValue(data),
    change: metric.calculateChange(data),
    chartData: metric.generateChartData(data)
  }
}
