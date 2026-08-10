import { ProfileHeaderCard } from '../../components/Profile/ProfileHeaderCard.jsx'
import { ProfileStatsGrid } from '../../components/Profile/ProfileStatsGrid.jsx'
import { ProfileWorkPanel } from '../../components/Profile/ProfileWorkPanel.jsx'
import { appointments, calls, customers, todayTasks } from '../../datas/employeePortalData.js'

const currentEmployee = {
  name: 'Lan Anh',
  title: 'Employee Consultant',
  email: 'lananh@di-ichi.edu.vn',
  phone: '0900 111 222',
  branch: 'Di-Ichi Phú Nhuận',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80',
}

const parseExpectedValue = (value) => Number(String(value).replace(/[^\d.]/g, '')) || 0

export const ProfilePage = () => {
  const ownedCustomers = customers.filter((customer) => customer.owner === currentEmployee.name)
  const ownedCustomerIds = ownedCustomers.map((customer) => customer.id)
  const ownedCalls = calls.filter((call) => call.owner === currentEmployee.name)
  const ownedAppointments = appointments.filter((appointment) => ownedCustomerIds.includes(appointment.customerId))
  const ownedTasks = todayTasks.filter((task) => ownedCustomerIds.includes(task.customerId))
  const expectedValue = ownedCustomers.reduce((total, customer) => total + parseExpectedValue(customer.expectedValue), 0)
  const stats = [
    { label: 'Khách hàng phụ trách', value: ownedCustomers.length },
    { label: 'Lượt gọi đã ghi nhận', value: ownedCustomers.reduce((total, customer) => total + customer.calledCount, 0) },
    { label: 'Lịch hẹn liên quan', value: ownedAppointments.length },
    { label: 'Giá trị dự kiến', value: `${expectedValue.toFixed(1)}M` },
  ]

  return (
    <div className="space-y-5">
      <ProfileHeaderCard profile={currentEmployee} />
      <ProfileStatsGrid stats={stats} />
      <ProfileWorkPanel appointments={ownedAppointments} calls={ownedCalls} customers={ownedCustomers} tasks={ownedTasks} />
    </div>
  )
}
