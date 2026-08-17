import { api } from './api.js'

const optionalString = (value) => {
  const normalizedValue = String(value ?? '').trim()
  return normalizedValue || undefined
}

const withoutUndefined = (payload) =>
  Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined))

const unwrapData = (response) => response.data?.data ?? response.data

export const parsePotentialCandidatesResponse = (body = {}) => {
  const container = body.data ?? body
  const data = Array.isArray(container)
    ? container
    : [
        container?.items,
        container?.results,
        container?.rows,
        container?.records,
        container?.candidates,
        container?.students,
        container?.data,
      ].find(Array.isArray) || []
  const pagination = body.meta
    || container?.meta
    || container?.pagination
    || body.pagination
    || (container && ('page' in container || 'size' in container || 'total' in container) ? container : null)

  if (!pagination) return { data, meta: null }

  const page = Number(pagination.page ?? pagination.currentPage ?? pagination.current_page ?? 1)
  const pageSize = Number(
    (pagination.pageSize ?? pagination.size ?? pagination.limit ?? pagination.perPage ?? pagination.per_page ?? data.length) || 20,
  )
  const totalItems = Number(
    pagination.totalItems ?? pagination.totalRecords ?? pagination.total ?? pagination.count ?? data.length,
  )
  const totalPages = Number(pagination.totalPages ?? pagination.lastPage ?? pagination.last_page)
    || Math.max(1, Math.ceil(totalItems / pageSize))

  return { data, meta: { page, pageSize, totalItems, totalPages } }
}

export const buildCreatePotentialCandidatePayload = (form) => {
  const birthYear = Number(form.birthYear)
  return withoutUndefined({
    name: optionalString(form.name),
    gender: form.gender,
    birthYear: Number.isInteger(birthYear) && birthYear > 0 ? birthYear : undefined,
    phone: optionalString(form.phone),
    email: optionalString(form.email),
    school: optionalString(form.school),
    className: optionalString(form.className),
    address: optionalString(form.address),
    fatherName: optionalString(form.fatherName),
    fatherPhone: optionalString(form.fatherPhone),
    motherName: optionalString(form.motherName),
    motherPhone: optionalString(form.motherPhone),
    parentInfo: optionalString(form.parentInfo),
    parentPhone: optionalString(form.parentPhone),
    note: optionalString(form.registrationNote),
  })
}

export const buildUpdatePotentialCandidatePayload = (form) => {
  const birthYear = Number(form.birthYear)

  return {
    name: String(form.name ?? '').trim(),
    gender: form.gender,
    birthYear: Number.isInteger(birthYear) && birthYear > 0 ? birthYear : null,
    school: String(form.school ?? '').trim(),
    className: String(form.className ?? '').trim(),
    certificates: Array.isArray(form.certificates) ? form.certificates : [],
    fatherName: String(form.fatherName ?? '').trim(),
    fatherPhone: String(form.fatherPhone ?? '').trim(),
    motherName: String(form.motherName ?? '').trim(),
    motherPhone: String(form.motherPhone ?? '').trim(),
    parentInfo: String(form.parentInfo ?? '').trim(),
    parentPhone: String(form.parentPhone ?? '').trim(),
    address: String(form.address ?? '').trim(),
    learningGoals: Array.isArray(form.learningGoals) ? form.learningGoals : [],
    otherLearningGoal: String(form.otherLearningGoal ?? '').trim(),
    englishExperience: Array.isArray(form.englishExperience) ? form.englishExperience : [],
    previousEnglishCenter: String(form.previousEnglishCenter ?? '').trim(),
    learningStyles: Array.isArray(form.learningStyles) ? form.learningStyles : [],
    registrationCourse: String(form.registrationCourse ?? '').trim(),
    registrationShift: String(form.registrationShift ?? '').trim(),
    registrationDays: String(form.registrationDays ?? '').trim(),
    registrationTuition: String(form.registrationTuition ?? '').trim(),
    registrationNote: String(form.registrationNote ?? '').trim(),
    desiredCourses: Array.isArray(form.desiredCourses) ? form.desiredCourses : [],
    freeSchedule: String(form.freeSchedule ?? '').trim(),
    callCount: Math.max(0, Number(form.callCount) || 0),
    status: form.status,
  }
}

export const getPotentialCandidates = async (params, signal) => {
  const response = await api.get('/potential-candidates', { params, signal })
  return parsePotentialCandidatesResponse(response.data)
}

export const getPotentialCandidate = async (candidateId) => {
  const response = await api.get(`/potential-candidates/${encodeURIComponent(candidateId)}`)
  return unwrapData(response)
}

export const createPotentialCandidate = async (form) => {
  const response = await api.post('/potential-candidates', buildCreatePotentialCandidatePayload(form))
  return unwrapData(response)
}

export const updatePotentialCandidate = async (candidateId, form) => {
  const response = await api.patch(
    `/potential-candidates/${encodeURIComponent(candidateId)}`,
    buildUpdatePotentialCandidatePayload(form),
  )
  return unwrapData(response)
}

export const deletePotentialCandidate = (candidateId) =>
  api.delete(`/potential-candidates/${encodeURIComponent(candidateId)}`)

export const importPotentialCandidates = async (file) => {
  const body = new FormData()
  body.append('file', file)
  const response = await api.post('/potential-candidates/import', body, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return unwrapData(response)
}

export const exportPotentialCandidates = (params) =>
  api.get('/potential-candidates/export', { params, responseType: 'blob' })

export const createPotentialCandidateAppointment = async (candidateId, appointment) => {
  const response = await api.post(
    `/potential-candidates/${encodeURIComponent(candidateId)}/appointments`,
    appointment,
  )
  return unwrapData(response)
}
