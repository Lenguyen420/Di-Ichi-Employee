import { api } from './api.js'

const optionalString = (value) => {
  const normalizedValue = String(value ?? '').trim()
  return normalizedValue || undefined
}

export const buildCreatePotentialCandidatePayload = (form) => {
  const birthYear = Number(form.birthYear)
  const payload = {
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
  }

  return Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined))
}

export const createPotentialCandidate = async (form) => {
  const response = await api.post('/potential-candidates', buildCreatePotentialCandidatePayload(form))
  return response.data?.data ?? response.data
}
