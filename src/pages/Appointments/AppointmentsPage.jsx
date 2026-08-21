import { useEffect, useMemo, useState } from 'react'
import { CalendarPlus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { AppointmentDetailModal } from '../../components/Appointments/AppointmentDetailModal.jsx'
import { AppointmentFilters } from '../../components/Appointments/AppointmentFilters.jsx'
import { AppointmentFormModal } from '../../components/Appointments/AppointmentFormModal.jsx'
import { AppointmentsTable } from '../../components/Appointments/AppointmentsTable.jsx'
import { allAppointmentsOption, emptyAppointmentForm } from '../../components/Appointments/appointmentHelpers.js'
import { Button } from '../../components/Common/Button.jsx'
import { appointmentStatuses, appointmentTypes } from '../../datas/appStaticData.js'
import { useAppointments } from '../../contexts/useAppointments.js'
import {
  createAppointment,
  deleteAppointment as deleteAppointmentApi,
  getAppointment,
  getAppointments,
  getPotentialCandidateOptions,
  updateAppointment as updateAppointmentApi,
} from '../../services/appointmentsApi.js'

const bangkokDateTimeParts = (value) => {
  if (!value) return { date: '', time: '' }
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date(value))
  const read = (type) => parts.find((part) => part.type === type)?.value || ''

  return {
    date: `${read('year')}-${read('month')}-${read('day')}`,
    time: `${read('hour')}:${read('minute')}`,
  }
}

const normalizeAppointment = (appointment = {}) => {
  const { date, time } = bangkokDateTimeParts(appointment.scheduledAt)
  return { ...appointment, date, time }
}

const getApiErrorMessage = (error, fallback, t) => {
  const backendMessage = error.response?.data?.error?.message || error.response?.data?.message
  if (backendMessage) return Array.isArray(backendMessage) ? backendMessage.join(' ') : backendMessage
  if (error.response?.status === 401) return t('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
  if (error.response?.status === 403) return t('Bạn không có quyền thao tác lịch hẹn của chi nhánh này.')
  if (!error.response) return t('Không thể kết nối máy chủ. Vui lòng thử lại.')
  return fallback
}

export const AppointmentsPage = () => {
  const { t } = useTranslation()
  const {
    appointments,
    setAppointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
  } = useAppointments()
  const [candidates, setCandidates] = useState([])
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState(allAppointmentsOption)
  const [typeFilter, setTypeFilter] = useState(allAppointmentsOption)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [form, setForm] = useState(emptyAppointmentForm)
  const [showForm, setShowForm] = useState(false)
  const [editingAppointmentId, setEditingAppointmentId] = useState(null)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState({ page: 1, size: 20, total: 0 })
  const [reloadKey, setReloadKey] = useState(0)

  const listParams = useMemo(() => ({
    q: keyword.trim() || undefined,
    status: statusFilter === allAppointmentsOption ? undefined : statusFilter,
    type: typeFilter === allAppointmentsOption ? undefined : typeFilter,
    page,
    size: 20,
    sortBy: 'scheduledAt',
    sortOrder: 'asc',
  }), [keyword, page, statusFilter, typeFilter])

  useEffect(() => {
    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      setIsLoading(true)
      try {
        const result = await getAppointments(listParams, controller.signal)
        setAppointments(result.data.map(normalizeAppointment))
        setMeta(result.meta)
      } catch (error) {
        if (error.code !== 'ERR_CANCELED') {
          toast.error(getApiErrorMessage(error, t('Không thể tải danh sách lịch hẹn.'), t))
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }, 300)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [listParams, reloadKey, setAppointments, t])

  useEffect(() => {
    const controller = new AbortController()
    getPotentialCandidateOptions('', controller.signal)
      .then(setCandidates)
      .catch((error) => {
        if (error.code !== 'ERR_CANCELED') {
          toast.error(getApiErrorMessage(error, t('Không thể tải danh sách ứng viên.'), t))
        }
      })
    return () => controller.abort()
  }, [t])

  const selectedCandidate = useMemo(
    () => candidates.find((candidate) => candidate.id === form.candidateId) || null,
    [candidates, form.candidateId],
  )

  const updateForm = (field, value) => {
    if (field === 'candidateSelect') {
      const matchedCandidate = candidates.find((candidate) => candidate.id === value)
      setForm((current) => ({
        ...current,
        customer: matchedCandidate?.name || '',
        phone: matchedCandidate?.parentPhone || '',
        customerId: matchedCandidate?.customerId || '',
        candidateId: matchedCandidate?.id || '',
      }))
      return
    }

    if (field === 'customer') {
      setForm((current) => ({ ...current, customer: value, candidateId: '', customerId: '' }))
      return
    }

    setForm((current) => ({ ...current, [field]: value }))
  }

  const openCreateForm = () => {
    setForm(emptyAppointmentForm)
    setEditingAppointmentId(null)
    setShowForm(true)
  }

  const openEditForm = async (appointment) => {
    try {
      const detail = normalizeAppointment(await getAppointment(appointment.id))
      setForm({
        customer: detail.customer || '',
        phone: detail.phone || '',
        customerId: detail.customerId || '',
        candidateId: detail.candidateId || '',
        type: detail.type || appointmentTypes[0],
        dateTime: `${detail.date}T${detail.time}`,
        room: detail.room || 'Online',
        status: detail.status || appointmentStatuses[0],
      })
      setEditingAppointmentId(detail.id)
      setShowForm(true)
    } catch (error) {
      toast.error(getApiErrorMessage(error, t('Không thể tải chi tiết lịch hẹn.'), t))
    }
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingAppointmentId(null)
    setForm(emptyAppointmentForm)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.customer.trim() || !form.dateTime) {
      toast.error(t('Vui lòng nhập tên ứng viên và ngày giờ hẹn.'))
      return
    }
    if (!form.candidateId && !form.phone.trim()) {
      toast.error(t('Vui lòng nhập SĐT khi tạo lịch cho khách tự do.'))
      return
    }

    setIsSubmitting(true)
    try {
      if (editingAppointmentId) {
        const saved = normalizeAppointment(await updateAppointmentApi(editingAppointmentId, form))
        updateAppointment(editingAppointmentId, saved)
        toast.success(t('Đã cập nhật lịch hẹn.'))
      } else {
        const saved = normalizeAppointment(await createAppointment(form))
        addAppointment(saved)
        toast.success(t('Đã tạo lịch hẹn.'))
      }
      closeForm()
      setReloadKey((current) => current + 1)
    } catch (error) {
      toast.error(getApiErrorMessage(error, editingAppointmentId ? t('Không thể cập nhật lịch hẹn.') : t('Không thể tạo lịch hẹn.'), t))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleView = async (appointment) => {
    try {
      setSelectedAppointment(normalizeAppointment(await getAppointment(appointment.id)))
    } catch (error) {
      toast.error(getApiErrorMessage(error, t('Không thể tải chi tiết lịch hẹn.'), t))
    }
  }

  const handleDelete = async (appointment) => {
    if (!window.confirm(t('Xóa lịch hẹn của {{customer}}?', { customer: appointment.customer }))) return

    try {
      await deleteAppointmentApi(appointment.id)
      deleteAppointment(appointment.id)
      setReloadKey((current) => current + 1)
      toast.success(t('Đã xóa lịch hẹn.'))
    } catch (error) {
      const fallback = error.response?.status === 409
        ? t('Không thể xóa lịch hẹn đã hoàn thành.')
        : t('Không thể xóa lịch hẹn.')
      toast.error(getApiErrorMessage(error, fallback, t))
    }
  }

  const totalPages = Math.max(1, Math.ceil(meta.total / meta.size))

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-bold text-orange-600">{t('Lịch hẹn')}</p>
          <h1 className="mt-1 text-2xl font-black text-slate-950 md:text-3xl">{t('Danh sách lịch hẹn')}</h1>
          <p className="mt-2 text-sm text-slate-500">{t('Theo dõi lịch test đầu vào, tư vấn, đóng học phí và ký hợp đồng.')}</p>
        </div>
        <Button type="button" onClick={openCreateForm}><CalendarPlus size={18} /> {t('Tạo lịch hẹn')}</Button>
      </div>

      {showForm && (
        <AppointmentFormModal
          candidates={candidates}
          form={form}
          isSubmitting={isSubmitting}
          mode={editingAppointmentId ? 'edit' : 'create'}
          selectedCandidate={selectedCandidate}
          selectedCandidateId={selectedCandidate?.id || ''}
          onChange={updateForm}
          onClose={closeForm}
          onSubmit={handleSubmit}
        />
      )}

      {selectedAppointment && <AppointmentDetailModal appointment={selectedAppointment} onClose={() => setSelectedAppointment(null)} />}

      <AppointmentFilters
        dateFrom={dateFrom}
        dateTo={dateTo}
        keyword={keyword}
        statusFilter={statusFilter}
        typeFilter={typeFilter}
        onDateFromChange={(value) => { setDateFrom(value); setPage(1) }}
        onDateToChange={(value) => { setDateTo(value); setPage(1) }}
        onKeywordChange={(value) => { setKeyword(value); setPage(1) }}
        onStatusFilterChange={(value) => { setStatusFilter(value); setPage(1) }}
        onTypeFilterChange={(value) => { setTypeFilter(value); setPage(1) }}
      />

      {isLoading ? (
        <div className="rounded-2xl border border-orange-100 bg-white px-5 py-12 text-center text-sm font-semibold text-slate-500">{t('Đang tải danh sách lịch hẹn...')}</div>
      ) : appointments.length ? (
        <AppointmentsTable appointments={appointments} onDelete={handleDelete} onEdit={openEditForm} onView={handleView} />
      ) : (
        <div className="rounded-2xl border border-orange-100 bg-white px-5 py-12 text-center text-sm font-semibold text-slate-500">{t('Không tìm thấy lịch hẹn phù hợp.')}</div>
      )}

      {!isLoading && totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
          <span>{t('Trang {{page}}/{{totalPages}} · {{total}} lịch hẹn', { page: meta.page, totalPages, total: meta.total })}</span>
          <div className="flex gap-2">
            <button className="rounded-lg border border-orange-200 bg-white px-4 py-2 font-semibold disabled:opacity-50" disabled={page <= 1} type="button" onClick={() => setPage((current) => current - 1)}>{t('Trang trước')}</button>
            <button className="rounded-lg border border-orange-200 bg-white px-4 py-2 font-semibold disabled:opacity-50" disabled={page >= totalPages} type="button" onClick={() => setPage((current) => current + 1)}>{t('Trang sau')}</button>
          </div>
        </div>
      )}
    </div>
  )
}
