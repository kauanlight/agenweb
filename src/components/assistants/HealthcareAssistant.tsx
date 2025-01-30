'use client'

import React, { useState, useCallback } from 'react'
import { 
  Calendar, 
  User, 
  MessageCircle, 
  Clock, 
  FileMedical, 
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

console.log('HealthcareAssistant module loaded');

console.error('HealthcareAssistant: Detailed Debug Information', {
  isClient: typeof window !== 'undefined',
  windowExists: typeof window,
  documentExists: typeof document,
  reactVersion: React.version
});

interface Patient {
  id: string
  name: string
  age: number
  lastAppointment: string
  nextAppointment?: string
  medicalHistory: string[]
  status: 'scheduled' | 'in-progress' | 'completed' | 'canceled'
}

interface Appointment {
  id: string
  patientId: string
  patientName: string
  date: string
  time: string
  type: 'general' | 'specialist' | 'follow-up'
  status: 'pending' | 'confirmed' | 'completed' | 'canceled'
}

export default function HealthcareAssistant() {
  console.log('HealthcareAssistant function called');
  console.log('Current environment:', typeof window !== 'undefined' ? 'Client' : 'Server');

  const [patients, setPatients] = useState<Patient[]>([
    {
      id: '1',
      name: 'Maria Silva',
      age: 45,
      lastAppointment: '2024-01-15',
      medicalHistory: ['Hipertensão', 'Diabetes'],
      status: 'scheduled'
    }
  ])

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      patientId: '1',
      patientName: 'Maria Silva',
      date: '2024-02-01',
      time: '14:30',
      type: 'follow-up',
      status: 'pending'
    }
  ])

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false)
  const [newAppointment, setNewAppointment] = useState<Partial<Appointment>>({})

  const handleCreateAppointment = useCallback(() => {
    if (selectedPatient && newAppointment.date && newAppointment.time) {
      const appointment: Appointment = {
        id: `apt${appointments.length + 1}`,
        patientId: selectedPatient.id,
        patientName: selectedPatient.name,
        date: newAppointment.date,
        time: newAppointment.time,
        type: newAppointment.type || 'general',
        status: 'pending'
      }

      setAppointments(prev => [...prev, appointment])
      setSelectedPatient(prev => prev ? {...prev, nextAppointment: appointment.date} : null)
      setIsAppointmentModalOpen(false)
      setNewAppointment({})
    }
  }, [selectedPatient, newAppointment, appointments.length])

  const getAppointmentStatusColor = (status: Appointment['status']) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-600'
      case 'confirmed': return 'bg-green-100 text-green-600'
      case 'completed': return 'bg-blue-100 text-blue-600'
      case 'canceled': return 'bg-red-100 text-red-600'
    }
  }

  const renderPatientsList = () => (
    <div>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <User className="mr-2" /> Pacientes
        <Button 
          size="sm" 
          variant="ghost" 
          className="ml-auto"
          onClick={() => {
            setSelectedPatient({} as Patient)
            setIsAppointmentModalOpen(true)
          }}
        >
          Novo Paciente
        </Button>
      </h3>
      <div className="space-y-2">
        {patients.map((patient) => (
          <Card 
            key={patient.id} 
            className={`p-3 hover:bg-gray-50 cursor-pointer ${
              patient.status === 'scheduled' ? 'border-green-200' : ''
            }`}
            onClick={() => {
              setSelectedPatient(patient)
              setIsAppointmentModalOpen(true)
            }}
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">{patient.name}</div>
                <div className="text-sm text-gray-500">
                  {patient.age} anos | Última consulta: {patient.lastAppointment}
                </div>
                <div className="mt-2 space-x-2">
                  {patient.medicalHistory.map((condition) => (
                    <Badge key={condition} variant="secondary" className="text-xs">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>
              <div 
                className={`px-2 py-1 rounded-full text-xs ${
                  patient.status === 'scheduled' 
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {patient.status === 'scheduled' ? 'Agendado' : 'Inativo'}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderAppointmentsList = () => (
    <div>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Calendar className="mr-2" /> Próximas Consultas
        <Button 
          size="sm" 
          variant="ghost" 
          className="ml-auto"
          onClick={() => setIsAppointmentModalOpen(true)}
        >
          Novo Agendamento
        </Button>
      </h3>
      <div className="space-y-2">
        {appointments.map((appointment) => (
          <Card key={appointment.id} className="p-3">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">{appointment.patientName}</div>
                <div className="text-sm text-gray-500">
                  {appointment.date} às {appointment.time}
                </div>
                <Badge variant="outline" className="mt-2">
                  {appointment.type === 'general' 
                    ? 'Consulta Geral' 
                    : appointment.type === 'specialist' 
                    ? 'Consulta Especializada' 
                    : 'Acompanhamento'}
                </Badge>
              </div>
              <div 
                className={`px-2 py-1 rounded-full text-xs ${
                  getAppointmentStatusColor(appointment.status)
                }`}
              >
                {appointment.status === 'pending' 
                  ? 'Pendente' 
                  : appointment.status === 'confirmed'
                  ? 'Confirmado'
                  : appointment.status === 'completed'
                  ? 'Concluído'
                  : 'Cancelado'}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderPatientDetailsModal = () => (
    <Dialog 
      open={isAppointmentModalOpen} 
      onOpenChange={setIsAppointmentModalOpen}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {selectedPatient?.id 
              ? 'Detalhes do Paciente' 
              : 'Novo Paciente/Agendamento'}
          </DialogTitle>
          <DialogDescription>
            Preencha as informações abaixo
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {!selectedPatient?.id && (
            <>
              <Input 
                placeholder="Nome do Paciente" 
                value={newAppointment.patientName || ''}
                onChange={(e) => setNewAppointment(prev => ({
                  ...prev, 
                  patientName: e.target.value
                }))}
              />
              <Input 
                type="number" 
                placeholder="Idade" 
                value={newAppointment.patientAge || ''}
                onChange={(e) => setNewAppointment(prev => ({
                  ...prev, 
                  patientAge: parseInt(e.target.value)
                }))}
              />
            </>
          )}
          
          <Select 
            value={newAppointment.type} 
            onValueChange={(value) => setNewAppointment(prev => ({
              ...prev, 
              type: value as Appointment['type']
            }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tipo de Consulta" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">Consulta Geral</SelectItem>
              <SelectItem value="specialist">Consulta Especializada</SelectItem>
              <SelectItem value="follow-up">Acompanhamento</SelectItem>
            </SelectContent>
          </Select>
          
          <Input 
            type="date" 
            placeholder="Data da Consulta"
            value={newAppointment.date || ''}
            onChange={(e) => setNewAppointment(prev => ({
              ...prev, 
              date: e.target.value
            }))}
          />
          
          <Input 
            type="time" 
            placeholder="Horário da Consulta"
            value={newAppointment.time || ''}
            onChange={(e) => setNewAppointment(prev => ({
              ...prev, 
              time: e.target.value
            }))}
          />
          
          <Button 
            onClick={handleCreateAppointment}
            disabled={!newAppointment.date || !newAppointment.time}
          >
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )

  const renderAppointmentDetailsModal = () => (
    <div>
      {/* Modal de detalhes de agendamento */}
    </div>
  )

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Assistente de Saúde</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderPatientsList()}
        {renderAppointmentsList()}
      </div>

      {renderPatientDetailsModal()}
      {renderAppointmentDetailsModal()}
    </div>
  )
}
