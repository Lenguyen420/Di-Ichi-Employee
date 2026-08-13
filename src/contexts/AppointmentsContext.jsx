import { useMemo, useState } from 'react'
import { appointmentStatuses, appointmentTypes } from '../datas/appStaticData.js'
import { appointments as initialAppointments } from '../datas/employeePortalData.js'
import { AppointmentsContext } from './appointmentsContext.js'

export const AppointmentsProvider = ({ children }) => {
  const [appointments, setAppointments] = useState(
    initialAppointments.map((appointment, index) => ({
      id: appointment.id || `LH-${index + 1001}`,
      ...appointment,
    })),
  )

  const addAppointment = (appointment) => {
    const savedAppointment = {
      id: appointment.id || `LH-${Date.now()}`,
      date: appointment.date,
      time: appointment.time,
      customer: appointment.customer,
      type: appointment.type || appointmentTypes[0],
      room: appointment.room || 'Online',
      status: appointment.status || appointmentStatuses[0],
      phone: appointment.phone || '',
      customerId: appointment.customerId || '',
      candidateId: appointment.candidateId || '',
    }

    setAppointments((current) => [savedAppointment, ...current])
    return savedAppointment
  }

  const updateAppointment = (appointmentId, appointment) => {
    const savedAppointment = {
      ...appointment,
      id: appointmentId,
      type: appointment.type || appointmentTypes[0],
      room: appointment.room || 'Online',
      status: appointment.status || appointmentStatuses[0],
      phone: appointment.phone || '',
      customerId: appointment.customerId || '',
      candidateId: appointment.candidateId || '',
    }

    setAppointments((current) => current.map((item) => (item.id === appointmentId ? savedAppointment : item)))
    return savedAppointment
  }

  const deleteAppointment = (appointmentId) => {
    setAppointments((current) => current.filter((appointment) => appointment.id !== appointmentId))
  }

  const value = useMemo(() => ({ appointments, addAppointment, updateAppointment, deleteAppointment }), [appointments])

  return <AppointmentsContext.Provider value={value}>{children}</AppointmentsContext.Provider>
}
