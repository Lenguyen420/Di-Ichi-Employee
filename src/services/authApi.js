import { api } from './api.js'

export const loginStaff = async ({ email, password }) => {
  const response = await api.post('/auth/staff/login', { email, password })
  return response.data?.data ?? response.data
}
