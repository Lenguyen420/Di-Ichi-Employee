import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { PotentialCandidateDetailModal } from '../../components/PotentialCandidates/PotentialCandidateDetailModal.jsx'
import { PotentialCandidateForm } from '../../components/PotentialCandidates/PotentialCandidateForm.jsx'
import { PotentialCandidatesHeader } from '../../components/PotentialCandidates/PotentialCandidatesHeader.jsx'
import { PotentialCandidatesOverviewCards } from '../../components/PotentialCandidates/PotentialCandidatesOverviewCards.jsx'
import { PotentialCandidatesSearch } from '../../components/PotentialCandidates/PotentialCandidatesSearch.jsx'
import { PotentialCandidatesTable } from '../../components/PotentialCandidates/PotentialCandidatesTable.jsx'
import { useAppointments } from '../../contexts/useAppointments.js'
import { usePotentialCandidates } from '../../contexts/usePotentialCandidates.js'
import {
  candidateStatusOptions,
  emptyCandidateAppointmentForm,
  emptyCandidateForm,
} from '../../datas/potentialCandidatesData.js'
import {
  createPotentialCandidate,
  createPotentialCandidateAppointment,
  deletePotentialCandidate,
  exportPotentialCandidates,
  getPotentialCandidate,
  getPotentialCandidates,
  importPotentialCandidates,
  updatePotentialCandidate,
} from '../../services/potentialCandidatesApi.js'

const splitList = (value) =>
  String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

const normalizeList = (value) => {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean)
  return splitList(value)
}

const compactJoin = (items, separator = ', ') => items.filter(Boolean).join(separator)

const guardianFields = [
  ['fatherName', 'fatherPhone', 'cha'],
  ['motherName', 'motherPhone', 'mẹ'],
  ['parentInfo', 'parentPhone', 'người liên hệ khác'],
]

const validateCandidate = (form) => {
  if (!form.name.trim()) return 'Vui lòng nhập tên ứng viên.'
  if (form.name.trim().length > 150) return 'Tên ứng viên không được vượt quá 150 ký tự.'

  const incompleteGuardian = guardianFields.find(([nameField, phoneField]) =>
    Boolean(form[nameField]?.trim()) !== Boolean(form[phoneField]?.trim()),
  )
  if (incompleteGuardian) return `Vui lòng nhập đủ họ tên và SĐT của ${incompleteGuardian[2]}.`

  const hasGuardian = guardianFields.some(([nameField, phoneField]) => form[nameField]?.trim() && form[phoneField]?.trim())
  if (!hasGuardian) return 'Vui lòng nhập ít nhất một người giám hộ có đủ họ tên và SĐT.'

  if (form.birthYear) {
    const birthYear = Number(form.birthYear)
    const currentYear = new Date().getFullYear()
    if (!Number.isInteger(birthYear) || birthYear < 1900 || birthYear > currentYear) {
      return `Năm sinh phải từ 1900 đến ${currentYear}.`
    }
  }

  return ''
}

const getApiErrorMessage = (error, fallback) => {
  const backendMessage = error.response?.data?.error?.message || error.response?.data?.message
  if (backendMessage) return Array.isArray(backendMessage) ? backendMessage.join(' ') : backendMessage
  if (error.response?.status === 401) return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
  if (error.response?.status === 403) return 'Bạn không có quyền thực hiện thao tác này.'
  if (!error.response) return 'Không thể kết nối máy chủ. Vui lòng thử lại.'
  return fallback
}

const normalizeCandidate = (candidate = {}) => {
  const guardians = Array.isArray(candidate.guardians) ? candidate.guardians : []
  const father = guardians.find((guardian) => guardian.relationship === 'father')
  const mother = guardians.find((guardian) => guardian.relationship === 'mother')
  const other = guardians.find((guardian) => guardian.relationship === 'other')
  const fatherName = candidate.fatherName ?? father?.name ?? ''
  const fatherPhone = candidate.fatherPhone ?? father?.phone ?? ''
  const motherName = candidate.motherName ?? mother?.name ?? ''
  const motherPhone = candidate.motherPhone ?? mother?.phone ?? ''
  const otherName = other?.name ?? ''
  const otherPhone = other?.phone ?? ''
  const hasGuardianDetails = guardians.length > 0 || [
    'fatherName',
    'fatherPhone',
    'motherName',
    'motherPhone',
  ].some((field) => Object.hasOwn(candidate, field))

  return {
    ...candidate,
    id: candidate.id || candidate.code,
    birthYear: candidate.birthYear ?? (candidate.birthDate ? String(candidate.birthDate).slice(0, 4) : ''),
    certificates: normalizeList(candidate.certificates),
    fatherName,
    fatherPhone,
    motherName,
    motherPhone,
    parentInfo: hasGuardianDetails
      ? candidate.parentInfo ?? otherName
      : candidate.parentInfo || compactJoin([fatherName ? `Cha: ${fatherName}` : '', motherName ? `Mẹ: ${motherName}` : '', otherName]),
    parentPhone: hasGuardianDetails
      ? candidate.parentPhone ?? otherPhone
      : candidate.parentPhone || compactJoin([fatherPhone, motherPhone, otherPhone]),
    learningGoals: normalizeList(candidate.learningGoals),
    englishExperience: normalizeList(candidate.englishExperience),
    learningStyles: normalizeList(candidate.learningStyles),
    desiredCourses: normalizeList(candidate.desiredCourses),
    callCount: Number(candidate.callCount) || 0,
    status: candidate.status || candidateStatusOptions[1],
  }
}

const toCandidateForm = (candidate) => ({
  ...emptyCandidateForm,
  ...normalizeCandidate(candidate),
  ...emptyCandidateAppointmentForm,
  certificates: normalizeList(candidate.certificates).join(', '),
  desiredCourses: normalizeList(candidate.desiredCourses).join(', '),
})

const toSavedCandidate = (candidateForm) => ({
  ...candidateForm,
  name: String(candidateForm.name ?? '').trim(),
  birthYear: String(candidateForm.birthYear ?? '').trim(),
  school: String(candidateForm.school ?? '').trim(),
  className: String(candidateForm.className ?? '').trim(),
  certificates: splitList(candidateForm.certificates),
  fatherName: String(candidateForm.fatherName ?? '').trim(),
  fatherPhone: String(candidateForm.fatherPhone ?? '').trim(),
  motherName: String(candidateForm.motherName ?? '').trim(),
  motherPhone: String(candidateForm.motherPhone ?? '').trim(),
  parentInfo: String(candidateForm.parentInfo ?? '').trim(),
  parentPhone: String(candidateForm.parentPhone ?? '').trim(),
  address: String(candidateForm.address ?? '').trim(),
  learningGoals: normalizeList(candidateForm.learningGoals),
  otherLearningGoal: String(candidateForm.otherLearningGoal ?? '').trim(),
  englishExperience: normalizeList(candidateForm.englishExperience),
  previousEnglishCenter: String(candidateForm.previousEnglishCenter ?? '').trim(),
  learningStyles: normalizeList(candidateForm.learningStyles),
  registrationCourse: String(candidateForm.registrationCourse ?? '').trim(),
  registrationShift: String(candidateForm.registrationShift ?? '').trim(),
  registrationDays: String(candidateForm.registrationDays ?? '').trim(),
  registrationTuition: String(candidateForm.registrationTuition ?? '').trim(),
  registrationNote: String(candidateForm.registrationNote ?? '').trim(),
  desiredCourses: splitList(candidateForm.desiredCourses),
  freeSchedule: String(candidateForm.freeSchedule ?? '').trim(),
  callCount: Math.max(0, Number(candidateForm.callCount) || 0),
})

const getDownloadName = (contentDisposition, format) => {
  const match = contentDisposition?.match(/filename\*?=(?:UTF-8''|")?([^";]+)/i)
  return match ? decodeURIComponent(match[1].replace(/"$/, '')) : `ung-vien-tiem-nang.${format}`
}

const overviewStages = [
  {
    id: 'lead',
    label: 'Lead',
    description: 'Ứng viên đang chăm sóc',
    iconClassName: 'bg-orange-50 text-orange-600',
    statuses: ['lead', 'mới', 'đang tư vấn', 'đã hẹn test', 'cần gọi lại'],
  },
  {
    id: 'studying',
    label: 'Đang học',
    description: 'Học viên đã vào lớp',
    iconClassName: 'bg-emerald-50 text-emerald-600',
    statuses: ['đang học'],
  },
  {
    id: 'reserved',
    label: 'Bảo lưu',
    description: 'Học viên tạm bảo lưu',
    iconClassName: 'bg-amber-50 text-amber-600',
    statuses: ['bảo lưu', 'bao lưu'],
  },
  {
    id: 'stopped',
    label: 'Nghỉ học',
    description: 'Học viên đã nghỉ',
    iconClassName: 'bg-rose-50 text-rose-600',
    statuses: ['nghỉ học', 'nghi học'],
  },
]

const leadStageId = overviewStages[0].id

const normalizeStageStatus = (value) => String(value || '').trim().toLowerCase()

const getCandidateOverviewStage = (candidate) => {
  const status = normalizeStageStatus(
    candidate.overviewStatus
      ?? candidate.lifecycleStatus
      ?? candidate.studentStatus
      ?? candidate.learningStatus
      ?? candidate.status,
  )
  const matchedStage = overviewStages.find((stage) => stage.statuses.includes(status))

  return matchedStage?.id || leadStageId
}

export const PotentialCandidatesPage = () => {
  const { addAppointment } = useAppointments()
  const { candidates, setCandidates } = usePotentialCandidates()
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState(candidateStatusOptions[0])
  const [appointmentDateFrom, setAppointmentDateFrom] = useState('')
  const [appointmentDateTo, setAppointmentDateTo] = useState('')
  const [selectedOverviewStage, setSelectedOverviewStage] = useState(leadStageId)
  const [editingCandidateId, setEditingCandidateId] = useState(null)
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [candidateForm, setCandidateForm] = useState(emptyCandidateForm)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState(null)

  const listParams = useMemo(() => ({
    q: keyword.trim() || undefined,
    status: statusFilter === candidateStatusOptions[0] ? undefined : statusFilter,
    page,
    pageSize: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  }), [keyword, page, statusFilter])

  useEffect(() => {
    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      setIsLoading(true)
      try {
        const result = await getPotentialCandidates(listParams, controller.signal)
        setCandidates(result.data.map(normalizeCandidate))
        setMeta(result.meta)
      } catch (error) {
        if (error.code !== 'ERR_CANCELED') {
          toast.error(getApiErrorMessage(error, 'Không thể tải danh sách ứng viên.'))
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }, 300)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [listParams, reloadKey, setCandidates])

  const reloadCandidates = () => setReloadKey((current) => current + 1)

  const overviewCards = useMemo(() => {
    const counts = Object.fromEntries(overviewStages.map((stage) => [stage.id, 0]))
    candidates.forEach((candidate) => {
      counts[getCandidateOverviewStage(candidate)] += 1
    })

    return overviewStages.map((stage) => ({ ...stage, count: counts[stage.id] || 0 }))
  }, [candidates])

  const visibleCandidates = useMemo(
    () => candidates.filter((candidate) => getCandidateOverviewStage(candidate) === selectedOverviewStage),
    [candidates, selectedOverviewStage],
  )

  const selectedOverviewLabel = overviewStages.find((stage) => stage.id === selectedOverviewStage)?.label || 'Lead'

  const handleOverviewStageSelect = (stageId) => {
    setSelectedOverviewStage(stageId)
    setPage(1)
    if (stageId !== leadStageId) setStatusFilter(candidateStatusOptions[0])
  }

  const updateCandidateForm = (field, value) => {
    setCandidateForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const validationMessage = validateCandidate(candidateForm)
    if (validationMessage) {
      toast.error(validationMessage)
      return
    }

    const savedCandidate = toSavedCandidate(candidateForm)
    setIsSubmitting(true)

    try {
      const responseCandidate = editingCandidateId
        ? await updatePotentialCandidate(editingCandidateId, savedCandidate)
        : await createPotentialCandidate(savedCandidate)
      const candidate = normalizeCandidate({ ...savedCandidate, ...responseCandidate })

      if (candidateForm.appointmentDateTime) {
        const appointment = await createPotentialCandidateAppointment(candidate.id, {
          scheduledAt: new Date(candidateForm.appointmentDateTime).toISOString(),
          type: candidateForm.appointmentType,
          room: candidateForm.appointmentRoom.trim() || 'Online',
          status: candidateForm.appointmentStatus,
        })
        const scheduledAt = new Date(appointment.scheduledAt)
        addAppointment({
          ...appointment,
          date: scheduledAt.toISOString().slice(0, 10),
          time: scheduledAt.toTimeString().slice(0, 5),
        })
        toast.success('Đã tạo lịch hẹn cho ứng viên.')
      }

      setCandidateForm(emptyCandidateForm)
      setEditingCandidateId(null)
      setShowForm(false)
      reloadCandidates()
      toast.success(editingCandidateId ? 'Đã cập nhật ứng viên.' : 'Đã thêm ứng viên mới.')
    } catch (error) {
      toast.error(getApiErrorMessage(error, editingCandidateId ? 'Không thể cập nhật ứng viên.' : 'Không thể tạo ứng viên.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImportFile = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    try {
      const result = await importPotentialCandidates(file)
      reloadCandidates()
      const message = `Đã import ${result.importedRows ?? 0}/${result.totalRows ?? 0} ứng viên.`
      if (result.failedRows) toast.warning(`${message} Có ${result.failedRows} dòng lỗi.`)
      else toast.success(message)
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Không thể import file ứng viên.'))
    }
  }

  const handleExport = async () => {
    try {
      const format = 'csv'
      const response = await exportPotentialCandidates({
        q: keyword.trim() || undefined,
        status: statusFilter === candidateStatusOptions[0] ? undefined : statusFilter,
        format,
      })
      const url = URL.createObjectURL(response.data)
      const link = document.createElement('a')
      link.href = url
      link.download = getDownloadName(response.headers['content-disposition'], format)
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Không thể export danh sách ứng viên.'))
    }
  }

  const handleCreateCandidate = () => {
    setCandidateForm(emptyCandidateForm)
    setEditingCandidateId(null)
    setShowForm(true)
  }

  const loadCandidateDetail = async (candidate, action) => {
    try {
      const detail = normalizeCandidate(await getPotentialCandidate(candidate.id))
      action(detail)
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Không thể tải chi tiết ứng viên.'))
    }
  }

  const handleEditCandidate = (candidate) => loadCandidateDetail(candidate, (detail) => {
    setCandidateForm(toCandidateForm(detail))
    setEditingCandidateId(detail.id)
    setShowForm(true)
  })

  const handleDeleteCandidate = async (candidate) => {
    if (!window.confirm(`Xóa ứng viên ${candidate.name}?`)) return

    try {
      await deletePotentialCandidate(candidate.id)
      reloadCandidates()
      toast.success('Đã xóa ứng viên.')
    } catch (error) {
      const fallback = error.response?.status === 409
        ? 'Ứng viên đã phát sinh dữ liệu nên không thể xóa.'
        : 'Không thể xóa ứng viên.'
      toast.error(getApiErrorMessage(error, fallback))
    }
  }

  return (
    <div className="space-y-5">
      <PotentialCandidatesHeader
        onExport={handleExport}
        onImportFile={handleImportFile}
        onToggleForm={handleCreateCandidate}
      />

      <PotentialCandidatesOverviewCards
        items={overviewCards}
        selectedId={selectedOverviewStage}
        onSelect={handleOverviewStageSelect}
      />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-black text-slate-800">Bộ lọc {selectedOverviewLabel}</p>
          <p className="mt-1 text-xs font-semibold text-slate-500">Danh sách bên dưới đang hiển thị theo card tổng quan đã chọn.</p>
        </div>
      </div>

      <PotentialCandidatesSearch
        appointmentDateFrom={appointmentDateFrom}
        appointmentDateTo={appointmentDateTo}
        keyword={keyword}
        showStatusFilter={selectedOverviewStage === leadStageId}
        statusFilter={statusFilter}
        onAppointmentDateFromChange={(value) => {
          setAppointmentDateFrom(value)
          setPage(1)
        }}
        onAppointmentDateToChange={(value) => {
          setAppointmentDateTo(value)
          setPage(1)
        }}
        onKeywordChange={(value) => {
          setKeyword(value)
          setPage(1)
        }}
        onStatusFilterChange={(value) => {
          setStatusFilter(value)
          setPage(1)
        }}
      />

      {showForm && (
        <PotentialCandidateForm
          form={candidateForm}
          isSubmitting={isSubmitting}
          mode={editingCandidateId ? 'edit' : 'create'}
          onChange={updateCandidateForm}
          onClose={() => {
            setShowForm(false)
            setEditingCandidateId(null)
          }}
          onReset={setCandidateForm}
          onSubmit={handleSubmit}
        />
      )}

      {selectedCandidate && (
        <PotentialCandidateDetailModal candidate={selectedCandidate} onClose={() => setSelectedCandidate(null)} />
      )}

      {isLoading ? (
        <div className="rounded-2xl border border-orange-100 bg-white px-5 py-12 text-center text-sm font-semibold text-slate-500">
          Đang tải danh sách ứng viên...
        </div>
      ) : visibleCandidates.length ? (
        <PotentialCandidatesTable
          candidates={visibleCandidates}
          onDelete={handleDeleteCandidate}
          onEdit={handleEditCandidate}
          onView={(candidate) => loadCandidateDetail(candidate, setSelectedCandidate)}
          rowNumberOffset={(page - 1) * (meta?.pageSize || 20)}
        />
      ) : (
        <div className="rounded-2xl border border-orange-100 bg-white px-5 py-12 text-center text-sm font-semibold text-slate-500">
          Không tìm thấy ứng viên phù hợp trong nhóm {selectedOverviewLabel}.
        </div>
      )}

      {!isLoading && meta?.totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
          <span>Trang {meta.page}/{meta.totalPages} · {meta.totalItems} ứng viên</span>
          <div className="flex gap-2">
            <button
              className="rounded-lg border border-orange-200 bg-white px-4 py-2 font-semibold disabled:cursor-not-allowed disabled:opacity-50"
              disabled={page <= 1}
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              Trang trước
            </button>
            <button
              className="rounded-lg border border-orange-200 bg-white px-4 py-2 font-semibold disabled:cursor-not-allowed disabled:opacity-50"
              disabled={page >= meta.totalPages}
              type="button"
              onClick={() => setPage((current) => Math.min(meta.totalPages, current + 1))}
            >
              Trang sau
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
