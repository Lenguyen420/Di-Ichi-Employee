import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalledCandidatesChart } from '../../components/Dashboard/CalledCandidatesChart.jsx'
import { DashboardDetailModal } from '../../components/Dashboard/DashboardDetailModal.jsx'
import { DashboardKpiCards } from '../../components/Dashboard/DashboardKpiCards.jsx'
import { DashboardListCards } from '../../components/Dashboard/DashboardListCards.jsx'
import { DashboardTasks } from '../../components/Dashboard/DashboardTasks.jsx'
import { useAppointments } from '../../contexts/useAppointments.js'
import { calledCandidatesSeries, customers, kpis, todayTasks } from '../../datas/employeePortalData.js'

export const DashboardPage = () => {
  const { appointments } = useAppointments()
  const navigate = useNavigate()
  const [selectedDetail, setSelectedDetail] = useState(null)

  const handleSelectKpi = (item) => {
    if (item.id === 'new-candidates') {
      navigate('/ung-vien-tiem-nang')
      return
    }

    if (item.id === 'today-appointments') {
      navigate('/lich-hen')
      return
    }

    setSelectedDetail(item)
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-bold text-orange-600">Dashboard</p>
        <h1 className="mt-1 text-2xl font-black text-slate-950 md:text-3xl">Tổng quan vận hành hôm nay</h1>
        <p className="mt-2 text-sm text-slate-500">Theo dõi KPI, ứng viên đã gọi, ứng viên mới, công việc và lịch hẹn trong ngày.</p>
      </div>

      <DashboardKpiCards kpis={kpis} onSelect={handleSelectKpi} />

      <div className="grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">
        <CalledCandidatesChart data={calledCandidatesSeries} />
        <DashboardTasks tasks={todayTasks} />
      </div>

      <DashboardListCards appointments={appointments} customers={customers} onOpenAppointments={() => navigate('/lich-hen')} onOpenCandidates={() => navigate('/ung-vien-tiem-nang')} />
      <DashboardDetailModal item={selectedDetail} onClose={() => setSelectedDetail(null)} />
    </div>
  )
}
