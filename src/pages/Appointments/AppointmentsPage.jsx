import { useMemo, useState } from 'react'
import { CalendarPlus } from 'lucide-react'
import { toast } from 'sonner'
import { AppointmentDetailModal } from '../../components/Appointments/AppointmentDetailModal.jsx'
import { AppointmentFilters } from '../../components/Appointments/AppointmentFilters.jsx'
import { AppointmentFormModal } from '../../components/Appointments/AppointmentFormModal.jsx'
import { AppointmentsTable } from '../../components/Appointments/AppointmentsTable.jsx'
import { allAppointmentsOption, emptyAppointmentForm, splitDateTime, toDateTimeValue } from '../../components/Appointments/appointmentHelpers.js'
import { Button } from '../../components/Common/Button.jsx'
import { appointmentStatuses, appointmentTypes } from '../../datas/appStaticData.js'
import { useAppointments } from '../../contexts/useAppointments.js'
import { usePotentialCandidates } from '../../contexts/usePotentialCandidates.js'

const normalizeCandidateName = (value) => String(value || '').trim().toLowerCase()

export const AppointmentsPage = () => {
  const { appointments, addAppointment, updateAppointment, deleteAppointment } = useAppointments()
  const { candidates } = usePotentialCandidates()
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState(allAppointmentsOption)
  const [typeFilter, setTypeFilter] = useState(allAppointmentsOption)
  const [form, setForm] = useState(emptyAppointmentForm)
  const [showForm, setShowForm] = useState(false)
  const [editingAppointmentId, setEditingAppointmentId] = useState(null)
  const [selectedAppointment, setSelectedAppointment] = useState(null)

  const filteredAppointments = useMemo(
    () =>
      appointments.filter((appointment) => {
        const matchesStatus = statusFilter === allAppointmentsOption || appointment.status === statusFilter
        const matchesType = typeFilter === allAppointmentsOption || appointment.type === typeFilter
        const matchesKeyword = [
          appointment.date,
          appointment.time,
          appointment.customer,
          appointment.phone,
          appointment.type,
          appointment.room,
          appointment.status,
        ]
          .join(' ')
          .toLowerCase()
          .includes(keyword.toLowerCase())

        return matchesStatus && matchesType && matchesKeyword
      }),
    [appointments, keyword, statusFilter, typeFilter],
  )

  const selectedCandidate = useMemo(
    () =>
      candidates.find((candidate) => (
        candidate.id === form.candidateId || normalizeCandidateName(candidate.name) === normalizeCandidateName(form.customer)
      )) || null,
    [candidates, form.candidateId, form.customer],
  )

  const selectedCandidateName = selectedCandidate ? selectedCandidate.name : ''

  const updateForm = (field, value) => {
    if (field === 'candidateSelect') {
      const matchedCandidate = candidates.find((candidate) => normalizeCandidateName(candidate.name) === normalizeCandidateName(value))

      setForm((current) => ({
        ...current,
        customer: matchedCandidate ? matchedCandidate.name : '',
        phone: matchedCandidate ? matchedCandidate.parentPhone || '' : '',
        customerId: matchedCandidate ? matchedCandidate.customerId || '' : '',
        candidateId: matchedCandidate ? matchedCandidate.id || '' : '',
      }))
      return
    }

    if (field === 'customer') {
      const matchedCandidate = candidates.find((candidate) => normalizeCandidateName(candidate.name) === normalizeCandidateName(value))

      setForm((current) => ({
        ...current,
        customer: value,
        phone: matchedCandidate ? matchedCandidate.parentPhone || '' : current.phone,
        customerId: matchedCandidate ? matchedCandidate.customerId || '' : '',
        candidateId: matchedCandidate ? matchedCandidate.id || '' : '',
      }))
      return
    }

    setForm((current) => ({ ...current, [field]: value }))
  }

  const openCreateForm = () => {
    setForm(emptyAppointmentForm)
    setEditingAppointmentId(null)
    setShowForm(true)
  }

  const openEditForm = (appointment) => {
    setForm({
      customer: appointment.customer || '',
      phone: appointment.phone || '',
      customerId: appointment.customerId || '',
      candidateId: appointment.candidateId || '',
      type: appointment.type || appointmentTypes[0],
      dateTime: toDateTimeValue(appointment),
      room: appointment.room || 'Online',
      status: appointment.status || appointmentStatuses[0],
    })
    setEditingAppointmentId(appointment.id)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingAppointmentId(null)
    setForm(emptyAppointmentForm)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!form.customer.trim() || !form.dateTime) {
      toast.error('Vui lòng nhập tên ứng viên và ngày giờ hẹn.')
      return
    }

    const { date, time } = splitDateTime(form.dateTime)
    const appointment = {
      date,
      time,
      customer: form.customer.trim(),
      phone: form.phone.trim(),
      customerId: form.customerId || '',
      candidateId: form.candidateId || '',
      type: form.type,
      room: form.room.trim(),
      status: form.status,
    }

    if (editingAppointmentId) {
      updateAppointment(editingAppointmentId, appointment)
      toast.success('Đã cập nhật lịch hẹn.')
    } else {
      addAppointment(appointment)
      toast.success('Đã tạo lịch hẹn.')
    }

    closeForm()
  }

  const handleDelete = (appointment) => {
    if (!window.confirm(`Xóa lịch hẹn của ${appointment.customer}?`)) return

    deleteAppointment(appointment.id)
    toast.success('Đã xóa lịch hẹn.')
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-bold text-orange-600">Lịch hẹn</p>
          <h1 className="mt-1 text-2xl font-black text-slate-950 md:text-3xl">Danh sách lịch hẹn</h1>
          <p className="mt-2 text-sm text-slate-500">Theo dõi lịch test đầu vào, tư vấn, đóng học phí và ký hợp đồng.</p>
        </div>
        <Button type="button" onClick={openCreateForm}><CalendarPlus size={18} /> Tạo lịch hẹn</Button>
      </div>

      {showForm && (
        <AppointmentFormModal
          form={form}
          candidates={candidates}
          selectedCandidate={selectedCandidate}
          selectedCandidateName={selectedCandidateName}
          mode={editingAppointmentId ? 'edit' : 'create'}
          onChange={updateForm}
          onClose={closeForm}
          onSubmit={handleSubmit}
        />
      )}

      {selectedAppointment && <AppointmentDetailModal appointment={selectedAppointment} onClose={() => setSelectedAppointment(null)} />}

      <AppointmentFilters
        keyword={keyword}
        statusFilter={statusFilter}
        typeFilter={typeFilter}
        onKeywordChange={setKeyword}
        onStatusFilterChange={setStatusFilter}
        onTypeFilterChange={setTypeFilter}
      />
      <AppointmentsTable appointments={filteredAppointments} onDelete={handleDelete} onEdit={openEditForm} onView={setSelectedAppointment} />
    </div>
  )
}
