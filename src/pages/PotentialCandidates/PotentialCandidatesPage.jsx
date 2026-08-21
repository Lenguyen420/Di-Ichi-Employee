import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
import { createAppointment } from '../../services/appointmentsApi.js'
import {
  createPotentialCandidate,
  deletePotentialCandidate,
  getAllPotentialCandidates,
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

const normalizeSearchText = (value) => String(value ?? '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .trim()

const guardianFields = [
  ['fatherName', 'fatherPhone', 'cha'],
  ['motherName', 'motherPhone', 'mẹ'],
  ['parentInfo', 'parentPhone', 'người liên hệ khác'],
]

const validateCandidate = (form, t) => {
  if (!form.name.trim()) return t('Vui lòng nhập tên ứng viên.')
  if (form.name.trim().length > 150) return t('Tên ứng viên không được vượt quá 150 ký tự.')

  const incompleteGuardian = guardianFields.find(([nameField, phoneField]) =>
    Boolean(form[nameField]?.trim()) !== Boolean(form[phoneField]?.trim()),
  )
  if (incompleteGuardian) return t('Vui lòng nhập đủ họ tên và SĐT của {{guardian}}.', { guardian: incompleteGuardian[2] })

  const hasGuardian = guardianFields.some(([nameField, phoneField]) => form[nameField]?.trim() && form[phoneField]?.trim())
  if (!hasGuardian) return t('Vui lòng nhập ít nhất một người giám hộ có đủ họ tên và SĐT.')

  if (form.birthYear) {
    const birthYear = Number(form.birthYear)
    const currentYear = new Date().getFullYear()
    if (!Number.isInteger(birthYear) || birthYear < 1900 || birthYear > currentYear) {
      return t('Năm sinh phải từ 1900 đến {{year}}.', { year: currentYear })
    }
  }

  return ''
}

const getApiErrorMessage = (error, fallback, t) => {
  const backendMessage = error.response?.data?.error?.message || error.response?.data?.message
  if (backendMessage) return Array.isArray(backendMessage) ? backendMessage.join(' ') : backendMessage
  if (error.response?.status === 401) return t('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
  if (error.response?.status === 403) return t('Bạn không có quyền thực hiện thao tác này.')
  if (!error.response) return t('Không thể kết nối máy chủ. Vui lòng thử lại.')
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
  const primaryGuardian = guardians.find((guardian) => guardian.isPrimary) || guardians[0]
  const relationshipLabels = { father: 'Cha', mother: 'Mẹ', other: 'Người liên hệ' }
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
      ? candidate.parentInfo ?? (primaryGuardian ? `${relationshipLabels[primaryGuardian.relationship] || 'Phụ huynh'}: ${primaryGuardian.name}` : '')
      : candidate.parentInfo || compactJoin([fatherName ? `Cha: ${fatherName}` : '', motherName ? `Mẹ: ${motherName}` : '', otherName]),
    parentPhone: hasGuardianDetails
      ? candidate.parentPhone ?? primaryGuardian?.phone ?? otherPhone
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

const overviewStages = [
  {
    id: 'lead',
    label: 'Lead',
    description: 'Ứng viên đang chăm sóc',
    iconClassName: 'bg-orange-50 text-orange-600',
    statuses: ['lead', 'potential', 'trial', 'mới', 'đang tư vấn', 'đã hẹn test', 'cần gọi lại'],
  },
  {
    id: 'studying',
    label: 'Đang học',
    description: 'Học viên đã vào lớp',
    iconClassName: 'bg-emerald-50 text-emerald-600',
    statuses: ['active', 'đang học'],
  },
  {
    id: 'reserved',
    label: 'Bảo lưu',
    description: 'Học viên tạm bảo lưu',
    iconClassName: 'bg-amber-50 text-amber-600',
    statuses: ['reserved', 'bảo lưu', 'bao lưu'],
  },
  {
    id: 'stopped',
    label: 'Nghỉ học',
    description: 'Học viên đã nghỉ',
    iconClassName: 'bg-rose-50 text-rose-600',
    statuses: ['stopped', 'nghỉ học', 'nghi học'],
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
  const { t } = useTranslation()
  const { addAppointment } = useAppointments()
  const { candidates, setCandidates } = usePotentialCandidates()
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState(candidateStatusOptions[0])
  const [selectedOverviewStage, setSelectedOverviewStage] = useState(leadStageId)
  const [editingCandidateId, setEditingCandidateId] = useState(null)
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [candidateForm, setCandidateForm] = useState(emptyCandidateForm)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)
  const [page, setPage] = useState(1)

  useEffect(() => {
    const controller = new AbortController()
    const loadCandidates = async () => {
      setIsLoading(true)
      try {
        const result = await getAllPotentialCandidates({ sortBy: 'createdAt', sortOrder: 'desc' }, controller.signal)
        setCandidates(result.map(normalizeCandidate))
      } catch (error) {
        if (error.code !== 'ERR_CANCELED') {
          toast.error(getApiErrorMessage(error, t('Không thể tải danh sách ứng viên.'), t))
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }

    loadCandidates()

    return () => {
      controller.abort()
    }
  }, [listParams, reloadKey, setCandidates, t])

  const reloadCandidates = () => setReloadKey((current) => current + 1)

  const overviewCards = useMemo(() => {
    const counts = Object.fromEntries(overviewStages.map((stage) => [stage.id, 0]))
    candidates.forEach((candidate) => {
      counts[getCandidateOverviewStage(candidate)] += 1
    })

    return overviewStages.map((stage) => ({ ...stage, count: counts[stage.id] || 0 }))
  }, [candidates])

  const filteredCandidates = useMemo(() => {
    const searchValue = normalizeSearchText(keyword)
    return candidates.filter((candidate) => {
      if (statusFilter !== candidateStatusOptions[0] && candidate.status !== statusFilter) return false
      if (!searchValue) return true

      const searchableValues = [
        candidate.id,
        candidate.code,
        candidate.name,
        candidate.gender,
        candidate.school,
        candidate.className,
        candidate.phone,
        candidate.email,
        candidate.address,
        candidate.parentInfo,
        candidate.parentPhone,
        candidate.fatherName,
        candidate.fatherPhone,
        candidate.motherName,
        candidate.motherPhone,
        ...(candidate.certificates || []),
        ...(candidate.desiredCourses || []),
      ]
      return searchableValues.some((value) => normalizeSearchText(value).includes(searchValue))
    })
  }, [candidates, keyword, statusFilter])

  const stageCandidates = useMemo(
    () => filteredCandidates.filter((candidate) => getCandidateOverviewStage(candidate) === selectedOverviewStage),
    [filteredCandidates, selectedOverviewStage],
  )
  const pageSize = 20
  const totalPages = Math.max(1, Math.ceil(stageCandidates.length / pageSize))
  const visibleCandidates = useMemo(
    () => stageCandidates.slice((page - 1) * pageSize, page * pageSize),
    [page, stageCandidates],
  )

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const selectedOverviewLabel = overviewStages.find((stage) => stage.id === selectedOverviewStage)?.label || 'Lead'

  const handleOverviewStageSelect = (stageId) => {
    setSelectedOverviewStage(stageId)
    setPage(1)
    if (stageId !== leadStageId) setStatusFilter(candidateStatusOptions[0])
  }

  const resetFilters = () => {
    setKeyword('')
    setStatusFilter(candidateStatusOptions[0])
    setPage(1)
  }

  const updateCandidateForm = (field, value) => {
    setCandidateForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const validationMessage = validateCandidate(candidateForm, t)
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
        const appointment = await createAppointment({
          candidateId: candidate.id,
          customer: candidate.name,
          phone: candidate.parentPhone,
          dateTime: candidateForm.appointmentDateTime,
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
        toast.success(t('Đã tạo lịch hẹn cho ứng viên.'))
      }

      setCandidateForm(emptyCandidateForm)
      setEditingCandidateId(null)
      setShowForm(false)
      reloadCandidates()
      toast.success(editingCandidateId ? t('Đã cập nhật ứng viên.') : t('Đã thêm ứng viên mới.'))
    } catch (error) {
      toast.error(getApiErrorMessage(error, editingCandidateId ? t('Không thể cập nhật ứng viên.') : t('Không thể tạo ứng viên.'), t))
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
      const message = t('Đã import {{imported}}/{{total}} ứng viên.', { imported: result.importedRows ?? 0, total: result.totalRows ?? 0 })
      if (result.failedRows) toast.warning(`${message} ${t('Có {{count}} dòng lỗi.', { count: result.failedRows })}`)
      else toast.success(message)
    } catch (error) {
      toast.error(getApiErrorMessage(error, t('Không thể import file ứng viên.'), t))
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
      toast.error(getApiErrorMessage(error, t('Không thể export danh sách ứng viên.'), t))
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
      toast.error(getApiErrorMessage(error, t('Không thể tải chi tiết ứng viên.'), t))
    }
  }

  const handleEditCandidate = (candidate) => loadCandidateDetail(candidate, (detail) => {
    setCandidateForm(toCandidateForm(detail))
    setEditingCandidateId(detail.id)
    setShowForm(true)
  })

  const handleDeleteCandidate = async (candidate) => {
    if (!window.confirm(t('Xóa ứng viên {{name}}?', { name: candidate.name }))) return

    try {
      await deletePotentialCandidate(candidate.id)
      reloadCandidates()
      toast.success(t('Đã xóa ứng viên.'))
    } catch (error) {
      const fallback = error.response?.status === 409
        ? t('Ứng viên đã phát sinh dữ liệu nên không thể xóa.')
        : t('Không thể xóa ứng viên.')
      toast.error(getApiErrorMessage(error, fallback, t))
    }
  }

  return (
    <div className="space-y-5">
      <PotentialCandidatesHeader
        onExport={handleExport}
        onToggleForm={handleCreateCandidate}
      />

      <PotentialCandidatesOverviewCards
        items={overviewCards}
        selectedId={selectedOverviewStage}
        onSelect={handleOverviewStageSelect}
      />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-black text-slate-800">{t('Bộ lọc {{stage}}', { stage: t(selectedOverviewLabel) })}</p>
          <p className="mt-1 text-xs font-semibold text-slate-500">{t('Danh sách bên dưới đang hiển thị theo card tổng quan đã chọn.')}</p>
        </div>
      </div>

      <PotentialCandidatesSearch
        keyword={keyword}
        showStatusFilter={selectedOverviewStage === leadStageId}
        statusFilter={statusFilter}
        onKeywordChange={(value) => {
          setKeyword(value)
          setPage(1)
        }}
        onReset={resetFilters}
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
          {t('Đang tải danh sách ứng viên...')}
        </div>
      ) : visibleCandidates.length ? (
        <PotentialCandidatesTable
          candidates={visibleCandidates}
          onDelete={handleDeleteCandidate}
          onEdit={handleEditCandidate}
          onView={(candidate) => loadCandidateDetail(candidate, setSelectedCandidate)}
          rowNumberOffset={(page - 1) * pageSize}
        />
      ) : (
        <div className="rounded-2xl border border-orange-100 bg-white px-5 py-12 text-center text-sm font-semibold text-slate-500">
          {t('Không tìm thấy ứng viên phù hợp trong nhóm {{stage}}.', { stage: t(selectedOverviewLabel) })}
        </div>
      )}

      {!isLoading && totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
          <span>{t('Trang {{page}}/{{totalPages}} · {{totalItems}} ứng viên', { page: meta.page, totalPages: meta.totalPages, totalItems: meta.totalItems })}</span>
          <div className="flex gap-2">
            <button
              className="rounded-lg border border-orange-200 bg-white px-4 py-2 font-semibold disabled:cursor-not-allowed disabled:opacity-50"
              disabled={page <= 1}
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              {t('Trang trước')}
            </button>
            <button
              className="rounded-lg border border-orange-200 bg-white px-4 py-2 font-semibold disabled:cursor-not-allowed disabled:opacity-50"
              disabled={page >= totalPages}
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            >
              {t('Trang sau')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
