import { api } from './api.js'
import { getBranchId } from './authSession.js'

const unwrapData = (response) => response.data?.data ?? response.data

export const getAppointments = async (params, signal) => {
  const response = await api.get('/appointments', {
    params: { branchId: getBranchId(), ...params },
    signal,
  })
  const result = unwrapData(response) || {}

  return {
    data: Array.isArray(result.data) ? result.data : [],
    meta: {
      page: Number(result.page) || 1,
      size: Number(result.size) || 20,
      total: Number(result.total) || 0,
    },
  }
}

export const getAppointment = async (appointmentId) => {
  const response = await api.get(`/appointments/${encodeURIComponent(appointmentId)}`)
  return unwrapData(response)
}

export const getPotentialCandidateOptions = async (q = '', signal) => {
  const response = await api.get('/potential-candidates/options', {
    params: { branchId: getBranchId(), q: q.trim() || undefined, limit: 100 },
    signal,
  })
  const result = unwrapData(response)
  return Array.isArray(result) ? result : []
}

const buildAppointmentPayload = (form) => {
  const candidateId = form.candidateId || null
  const scheduledAt = `${form.dateTime.length === 16 ? `${form.dateTime}:00` : form.dateTime}+07:00`

  return {
    branchId: getBranchId(),
    candidateId,
    ...(candidateId ? {} : {
      customer: String(form.customer || '').trim(),
      phone: String(form.phone || '').trim(),
    }),
    scheduledAt,
    type: form.type,
    room: String(form.room || '').trim() || 'Online',
    status: form.status,
  }
}

export const createAppointment = async (form) => {
  const response = await api.post('/appointments', buildAppointmentPayload(form))
  return unwrapData(response)
}

export const updateAppointment = async (appointmentId, form) => {
  const response = await api.patch(
    `/appointments/${encodeURIComponent(appointmentId)}`,
    buildAppointmentPayload(form),
  )
  return unwrapData(response)
}

export const deleteAppointment = (appointmentId) =>
  api.delete(`/appointments/${encodeURIComponent(appointmentId)}`)
