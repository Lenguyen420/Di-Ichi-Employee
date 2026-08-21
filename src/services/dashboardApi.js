import { api } from './api.js'
import { getBranchId } from './authSession.js'

const unwrapData = (response) => response.data?.data ?? response.data

export const getDashboardOverview = async ({ date, chartMonths = 6, listLimit = 3 }, signal) => {
  const response = await api.get('/dashboard/overview', {
    params: {
      branchId: getBranchId(),
      date,
      timezone: 'Asia/Bangkok',
      chartMonths,
      listLimit,
    },
    signal,
  })

  return unwrapData(response)
}
