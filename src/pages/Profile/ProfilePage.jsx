import { useTranslation } from 'react-i18next'
import { ProfileHeaderCard } from '../../components/Profile/ProfileHeaderCard.jsx'
import { ProfileStatsGrid } from '../../components/Profile/ProfileStatsGrid.jsx'
import { ProfileWorkPanel } from '../../components/Profile/ProfileWorkPanel.jsx'
import { currentEmployee } from '../../datas/appStaticData.js'
import { appointments, calls, customers, todayTasks } from '../../datas/employeePortalData.js'

const parseExpectedValue = (value) => Number(String(value).replace(/[^\d.]/g, '')) || 0

export const ProfilePage = () => {
  const { t } = useTranslation()
  const ownedCustomers = customers.filter((customer) => customer.owner === currentEmployee.name)
  const ownedCustomerIds = ownedCustomers.map((customer) => customer.id)
  const ownedCalls = calls.filter((call) => call.owner === currentEmployee.name)
  const ownedAppointments = appointments.filter((appointment) => ownedCustomerIds.includes(appointment.customerId))
  const ownedTasks = todayTasks.filter((task) => ownedCustomerIds.includes(task.customerId))
  const expectedValue = ownedCustomers.reduce((total, customer) => total + parseExpectedValue(customer.expectedValue), 0)
  const stats = [
    { label: t('Khách hàng phụ trách'), value: ownedCustomers.length },
    { label: t('Lượt gọi đã ghi nhận'), value: ownedCustomers.reduce((total, customer) => total + customer.calledCount, 0) },
    { label: t('Lịch hẹn liên quan'), value: ownedAppointments.length },
    { label: t('Giá trị dự kiến'), value: `${expectedValue.toFixed(1)}M` },
  ]

  return (
    <div className="space-y-5">
      <ProfileHeaderCard profile={currentEmployee} />
      <ProfileStatsGrid stats={stats} />
      <ProfileWorkPanel appointments={ownedAppointments} calls={ownedCalls} customers={ownedCustomers} tasks={ownedTasks} />
    </div>
  )
}
