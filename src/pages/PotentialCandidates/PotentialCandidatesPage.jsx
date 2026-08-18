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
import { createAppointment, getAppointments } from '../../services/appointmentsApi.js'
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
  const { addAppointment } = useAppointments()
  const { candidates, setCandidates } = usePotentialCandidates()
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState(candidateStatusOptions[0])
  const [appointmentDateFrom, setAppointmentDateFrom] = useState('')
  const [appointmentDateTo, setAppointmentDateTo] = useState('')
  const [appointmentCandidateIds, setAppointmentCandidateIds] = useState(null)
  const [genderFilter, setGenderFilter] = useState('')
  const [schoolFilter, setSchoolFilter] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [selectedOverviewStage, setSelectedOverviewStage] = useState(leadStageId)
  const [editingCandidateId, setEditingCandidateId] = useState(null)
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [candidateForm, setCandidateForm] = useState(emptyCandidateForm)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)
  const [page, setPage] = useState(1)

  const listParams = useMemo(() => ({ sortBy, sortOrder }), [sortBy, sortOrder])

  useEffect(() => {
    const controller = new AbortController()
    const loadCandidates = async () => {
      setIsLoading(true)
      try {
        const result = await getAllPotentialCandidates(listParams, controller.signal)
        setCandidates(result.map(normalizeCandidate))
      } catch (error) {
        if (error.code !== 'ERR_CANCELED') {
          toast.error(getApiErrorMessage(error, 'Không thể tải danh sách ứng viên.'))
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }

    loadCandidates()

    return () => {
      controller.abort()
    }
  }, [listParams, reloadKey, setCandidates])

  useEffect(() => {
    if (!appointmentDateFrom && !appointmentDateTo) {
      setAppointmentCandidateIds(null)
      return undefined
    }

    const controller = new AbortController()
    const loadAppointmentCandidates = async () => {
      try {
        const params = {
          dateFrom: appointmentDateFrom || undefined,
          dateTo: appointmentDateTo || undefined,
          page: 1,
          size: 100,
          sortBy: 'scheduledAt',
          sortOrder: 'asc',
        }
        const firstPage = await getAppointments(params, controller.signal)
        const totalPages = Math.max(1, Math.ceil(firstPage.meta.total / firstPage.meta.size))
        const remainingPages = totalPages > 1
          ? await Promise.all(Array.from({ length: totalPages - 1 }, (_, index) =>
            getAppointments({ ...params, page: index + 2 }, controller.signal)))
          : []
        const ids = [firstPage, ...remainingPages]
          .flatMap((result) => result.data)
          .map((appointment) => appointment.candidateId)
          .filter(Boolean)
        setAppointmentCandidateIds(new Set(ids))
      } catch (error) {
        if (error.code !== 'ERR_CANCELED') {
          toast.error(getApiErrorMessage(error, 'Không thể lọc ứng viên theo ngày hẹn.'))
          setAppointmentCandidateIds(new Set())
        }
      }
    }

    loadAppointmentCandidates()
    return () => controller.abort()
  }, [appointmentDateFrom, appointmentDateTo])

  const reloadCandidates = () => setReloadKey((current) => current + 1)

  const overviewCards = useMemo(() => {
    const counts = Object.fromEntries(overviewStages.map((stage) => [stage.id, 0]))
    candidates.forEach((candidate) => {
      counts[getCandidateOverviewStage(candidate)] += 1
    })

    return overviewStages.map((stage) => ({ ...stage, count: counts[stage.id] || 0 }))
  }, [candidates])

  const schoolOptions = useMemo(() => [...new Set(candidates.map((candidate) => candidate.school).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'vi')), [candidates])

  const filteredCandidates = useMemo(() => {
    const searchValue = normalizeSearchText(keyword)
    return candidates.filter((candidate) => {
      if (statusFilter !== candidateStatusOptions[0] && candidate.status !== statusFilter) return false
      if (genderFilter && candidate.gender !== genderFilter) return false
      if (schoolFilter && candidate.school !== schoolFilter) return false
      if (appointmentCandidateIds && !appointmentCandidateIds.has(candidate.id)) return false
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
  }, [appointmentCandidateIds, candidates, genderFilter, keyword, schoolFilter, statusFilter])

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
    setGenderFilter('')
    setSchoolFilter('')
    setAppointmentDateFrom('')
    setAppointmentDateTo('')
    setSortBy('createdAt')
    setSortOrder('desc')
    setPage(1)
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

  const handleExport = () => {
    const escapeCsv = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`
    const headers = ['Mã', 'Tên', 'Giới tính', 'Trường', 'Lớp', 'Phụ huynh', 'SĐT phụ huynh', 'Địa chỉ', 'Trạng thái']
    const rows = stageCandidates.map((candidate) => [
      candidate.id,
      candidate.name,
      candidate.gender,
      candidate.school,
      candidate.className,
      candidate.parentInfo,
      candidate.parentPhone,
      candidate.address,
      candidate.status,
    ])
    const csv = [headers, ...rows].map((row) => row.map(escapeCsv).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'ung-vien-tiem-nang.csv'
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  const handleCreateCandidate = () => {
    setCandidateForm(emptyCandidateForm)
    setEditingCandidateId(null)
    setShowForm(true)
  }

  const loadCandidateDetail = (candidate, action) => action(normalizeCandidate(candidate))

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
        genderFilter={genderFilter}
        keyword={keyword}
        schoolFilter={schoolFilter}
        schoolOptions={schoolOptions}
        showStatusFilter={selectedOverviewStage === leadStageId}
        sortBy={sortBy}
        sortOrder={sortOrder}
        statusFilter={statusFilter}
        onAppointmentDateFromChange={(value) => {
          setAppointmentDateFrom(value)
          setPage(1)
        }}
        onAppointmentDateToChange={(value) => {
          setAppointmentDateTo(value)
          setPage(1)
        }}
        onGenderFilterChange={(value) => {
          setGenderFilter(value)
          setPage(1)
        }}
        onKeywordChange={(value) => {
          setKeyword(value)
          setPage(1)
        }}
        onReset={resetFilters}
        onSchoolFilterChange={(value) => {
          setSchoolFilter(value)
          setPage(1)
        }}
        onSortByChange={(value) => {
          setSortBy(value)
          setPage(1)
        }}
        onSortOrderChange={(value) => {
          setSortOrder(value)
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
          rowNumberOffset={(page - 1) * pageSize}
        />
      ) : (
        <div className="rounded-2xl border border-orange-100 bg-white px-5 py-12 text-center text-sm font-semibold text-slate-500">
          Không tìm thấy ứng viên phù hợp trong nhóm {selectedOverviewLabel}.
        </div>
      )}

      {!isLoading && totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
          <span>Trang {page}/{totalPages} · {stageCandidates.length} ứng viên</span>
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
              disabled={page >= totalPages}
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            >
              Trang sau
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
