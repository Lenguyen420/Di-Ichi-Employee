import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json',
  },
})

const readAccessToken = () => {
  const directToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')
  if (directToken) return directToken

  const rawSession = localStorage.getItem('diIchiEmployeeSession') || sessionStorage.getItem('diIchiEmployeeSession')
  if (!rawSession) return ''

  try {
    const session = JSON.parse(rawSession)
    return session.accessToken || session.access_token || session.token || ''
  } catch {
    return ''
  }
}

api.interceptors.request.use((config) => {
  const accessToken = readAccessToken()

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})
