import { useContext } from 'react'
import { AppointmentsContext } from './appointmentsContext.js'

export const useAppointments = () => {
  const context = useContext(AppointmentsContext)
  if (!context) throw new Error('useAppointments must be used inside AppointmentsProvider')
  return context
}
