import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { DashboardDetailModal } from '../../components/Dashboard/DashboardDetailModal.jsx'
import { DashboardKpiCards } from '../../components/Dashboard/DashboardKpiCards.jsx'
import { DashboardListCards } from '../../components/Dashboard/DashboardListCards.jsx'
import { DashboardTasks } from '../../components/Dashboard/DashboardTasks.jsx'
import { getDashboardOverview } from '../../services/dashboardApi.js'

const getBangkokDate = () => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Bangkok',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).format(new Date())

const getBangkokTime = (value) => {
  if (!value) return ''
  return new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Bangkok',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(new Date(value))
}

const getApiErrorMessage = (error) => {
  const backendMessage = error.response?.data?.error?.message || error.response?.data?.message
  if (backendMessage) return Array.isArray(backendMessage) ? backendMessage.join(' ') : backendMessage
  if (error.response?.status === 401) return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
  if (error.response?.status === 403) return 'Bạn không có quyền xem Dashboard của chi nhánh này.'
  if (!error.response) return 'Không thể kết nối máy chủ. Vui lòng thử lại.'
  return 'Không thể tải dữ liệu Dashboard.'
}

export const DashboardPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [selectedDetail, setSelectedDetail] = useState(null)
  const [overview, setOverview] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    const loadOverview = async () => {
      setIsLoading(true)
      setErrorMessage('')
      try {
        const data = await getDashboardOverview({ date: getBangkokDate() }, controller.signal)
        setOverview(data)
      } catch (error) {
        if (error.code !== 'ERR_CANCELED') {
          const message = getApiErrorMessage(error)
          setErrorMessage(message)
          toast.error(message)
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }

    loadOverview()
    return () => controller.abort()
  }, [reloadKey])

  const kpis = useMemo(() => {
    const summary = overview?.summary
    return [
      {
        id: 'new-candidates',
        label: 'Ứng viên mới',
        value: summary?.newCandidates?.value ?? 0,
        change: `+${summary?.newCandidates?.todayIncrease ?? 0}`,
        tone: 'orange',
        detail: 'Ứng viên mới từ các nguồn tuyển sinh của trung tâm.',
      },
      {
        id: 'today-appointments',
        label: 'Lịch hẹn hôm nay',
        value: summary?.todayAppointments?.value ?? 0,
        change: `${summary?.todayAppointments?.placementTestCount ?? 0} test đầu vào`,
        tone: 'amber',
        detail: 'Bao gồm tư vấn, test đầu vào, đóng học phí và ký hợp đồng.',
      },
      {
        id: 'pending-tasks',
        label: 'Công việc còn lại',
        value: summary?.pendingTasks?.value ?? 0,
        change: `${summary?.pendingTasks?.overdueCount ?? 0} quá hạn`,
        tone: 'rose',
        detail: 'Các công việc chăm sóc và theo dõi chưa hoàn tất.',
      },
    ]
  }, [overview])

  const todayAppointments = useMemo(() => (overview?.todayAppointments || []).map((appointment) => ({
    ...appointment,
    time: getBangkokTime(appointment.scheduledAt),
  })), [overview])

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
        <p className="text-sm font-bold text-orange-600">{t('Dashboard')}</p>
        <h1 className="mt-1 text-2xl font-black text-slate-950 md:text-3xl">{t('Tổng quan vận hành hôm nay')}</h1>
        <p className="mt-2 text-sm text-slate-500">{t('Theo dõi KPI, ứng viên đã gọi, ứng viên mới, công việc và lịch hẹn trong ngày.')}</p>
      </div>

      {isLoading ? (
        <div className="rounded-lg border border-orange-100 bg-white px-5 py-16 text-center text-sm font-semibold text-slate-500">
          Đang tải dữ liệu Dashboard...
        </div>
      ) : errorMessage ? (
        <div className="rounded-lg border border-rose-200 bg-white px-5 py-12 text-center">
          <p className="text-sm font-semibold text-rose-600">{errorMessage}</p>
          <button className="mt-4 rounded-lg bg-orange-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-orange-700" type="button" onClick={() => setReloadKey((current) => current + 1)}>
            Thử lại
          </button>
        </div>
      ) : (
        <>
          <DashboardKpiCards kpis={kpis} onSelect={handleSelectKpi} />

          <DashboardTasks tasks={overview?.todayTasks || []} />

          <DashboardListCards appointments={todayAppointments} customers={overview?.newCandidates || []} onOpenAppointments={() => navigate('/lich-hen')} onOpenCandidates={() => navigate('/ung-vien-tiem-nang')} />
        </>
      )}
      <DashboardDetailModal item={selectedDetail} onClose={() => setSelectedDetail(null)} />
    </div>
  )
}
