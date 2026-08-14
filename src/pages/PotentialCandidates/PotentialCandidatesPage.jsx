import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { PotentialCandidateDetailModal } from '../../components/PotentialCandidates/PotentialCandidateDetailModal.jsx'
import { PotentialCandidateForm } from '../../components/PotentialCandidates/PotentialCandidateForm.jsx'
import { PotentialCandidatesHeader } from '../../components/PotentialCandidates/PotentialCandidatesHeader.jsx'
import { PotentialCandidatesSearch } from '../../components/PotentialCandidates/PotentialCandidatesSearch.jsx'
import { PotentialCandidatesTable } from '../../components/PotentialCandidates/PotentialCandidatesTable.jsx'
import { useAppointments } from '../../contexts/useAppointments.js'
import { usePotentialCandidates } from '../../contexts/usePotentialCandidates.js'
import { emptyCandidateAppointmentForm, emptyCandidateForm } from '../../datas/potentialCandidatesData.js'

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

const buildParentInfo = (candidateForm) =>
  compactJoin([
    candidateForm.fatherName?.trim() ? `Cha: ${candidateForm.fatherName.trim()}` : '',
    candidateForm.motherName?.trim() ? `Mẹ: ${candidateForm.motherName.trim()}` : '',
    candidateForm.parentInfo?.trim(),
  ])

const buildParentPhone = (candidateForm) =>
  compactJoin([candidateForm.fatherPhone?.trim(), candidateForm.motherPhone?.trim(), candidateForm.parentPhone?.trim()])

const normalizeImportedCandidate = (candidate) => {
  const fatherName = String(candidate.fatherName || candidate.tenCha || candidate['họ tên cha'] || '').trim()
  const fatherPhone = String(candidate.fatherPhone || candidate.sdtCha || candidate['sđt cha'] || '').trim()
  const motherName = String(candidate.motherName || candidate.tenMe || candidate['họ tên mẹ'] || '').trim()
  const motherPhone = String(candidate.motherPhone || candidate.sdtMe || candidate['sđt mẹ'] || '').trim()
  const parentInfo = String(candidate.parentInfo || candidate.phuHuynh || candidate['phụ huynh'] || '').trim()
  const parentPhone = String(candidate.parentPhone || candidate.sdtPhuHuynh || candidate['sđt phụ huynh'] || candidate.phone || '').trim()

  return {
    name: String(candidate.name || candidate.ten || '').trim(),
    gender: String(candidate.gender || candidate.gioiTinh || candidate['giới tính'] || 'Nam').trim(),
    birthYear: String(candidate.birthYear || candidate.namSinh || candidate['năm sinh'] || '').trim(),
    school: String(candidate.school || candidate.truong || candidate['trường'] || '').trim(),
    className: String(candidate.className || candidate.lop || candidate['lớp'] || '').trim(),
    certificates: normalizeList(candidate.certificates || candidate.chungChi || candidate['chứng chỉ']),
    fatherName,
    fatherPhone,
    motherName,
    motherPhone,
    parentInfo: parentInfo || compactJoin([fatherName ? `Cha: ${fatherName}` : '', motherName ? `Mẹ: ${motherName}` : '']),
    parentPhone: parentPhone || compactJoin([fatherPhone, motherPhone]),
    address: String(candidate.address || candidate.diaChi || candidate['địa chỉ'] || '').trim(),
    learningGoals: normalizeList(candidate.learningGoals || candidate.mucTieu || candidate['mục tiêu']),
    otherLearningGoal: String(candidate.otherLearningGoal || candidate.mucTieuKhac || candidate['mục tiêu khác'] || '').trim(),
    englishExperience: normalizeList(candidate.englishExperience || candidate.quaTrinhHoc || candidate['quá trình học']),
    previousEnglishCenter: String(candidate.previousEnglishCenter || candidate.trungTamCu || candidate['trung tâm cũ'] || '').trim(),
    learningStyles: normalizeList(candidate.learningStyles || candidate.hinhThucHoc || candidate['hình thức học']),
    registrationCourse: String(candidate.registrationCourse || candidate.khoaDangKy || candidate['khóa học đăng ký'] || '').trim(),
    registrationShift: String(candidate.registrationShift || candidate.caHoc || candidate['ca học'] || '').trim(),
    registrationDays: String(candidate.registrationDays || candidate.ngayHoc || candidate['ngày học'] || '').trim(),
    registrationTuition: String(candidate.registrationTuition || candidate.hocPhi || candidate['học phí'] || '').trim(),
    registrationNote: String(candidate.registrationNote || candidate.ghiChu || candidate['ghi chú'] || '').trim(),
    desiredCourses: normalizeList(candidate.desiredCourses || candidate.khoaHoc || candidate['khóa học']),
    freeSchedule: String(candidate.freeSchedule || candidate.lichRanh || candidate['lịch rảnh'] || '').trim(),
    callCount: Number(candidate.callCount || candidate.soLanGoi || candidate['số lần gọi'] || 0),
    status: String(candidate.status || candidate.trangThai || candidate['trạng thái'] || 'Mới').trim(),
  }
}

const parseCsv = (text) => {
  const lines = text.trim().split(/\r?\n/).filter(Boolean)
  if (lines.length < 2) return []

  const headers = lines[0].split(',').map((header) => header.trim())

  return lines.slice(1).map((line) => {
    const values = line.split(',').map((value) => value.trim())
    return headers.reduce((row, header, index) => ({ ...row, [header]: values[index] || '' }), {})
  })
}

const createCandidateId = () => `UV-${Date.now()}`

const toCandidateForm = (candidate) => ({
  ...emptyCandidateForm,
  ...candidate,
  ...emptyCandidateAppointmentForm,
  certificates: normalizeList(candidate.certificates).join(', '),
  desiredCourses: normalizeList(candidate.desiredCourses).join(', '),
  learningGoals: normalizeList(candidate.learningGoals),
  englishExperience: normalizeList(candidate.englishExperience),
  learningStyles: normalizeList(candidate.learningStyles),
})

const splitDateTime = (dateTime) => {
  const [date = '', time = ''] = String(dateTime || '').split('T')
  return { date, time }
}

export const PotentialCandidatesPage = () => {
  const { addAppointment } = useAppointments()
  const { candidates, setCandidates } = usePotentialCandidates()
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState('Tất cả')
  const [editingCandidateId, setEditingCandidateId] = useState(null)
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [candidateForm, setCandidateForm] = useState(emptyCandidateForm)

  const updateCandidateForm = (field, value) => {
    setCandidateForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const parentInfo = buildParentInfo(candidateForm)
    const parentPhone = buildParentPhone(candidateForm)

    if (!candidateForm.name.trim() || !parentInfo || !parentPhone) {
      toast.error('Vui lòng nhập tên ứng viên, thông tin phụ huynh và SĐT phụ huynh.')
      return
    }

    const savedCandidate = {
      ...candidateForm,
      id: candidateForm.id || createCandidateId(),
      name: candidateForm.name.trim(),
      gender: candidateForm.gender,
      birthYear: candidateForm.birthYear.trim(),
      school: candidateForm.school.trim(),
      className: candidateForm.className.trim(),
      certificates: splitList(candidateForm.certificates),
      fatherName: candidateForm.fatherName.trim(),
      fatherPhone: candidateForm.fatherPhone.trim(),
      motherName: candidateForm.motherName.trim(),
      motherPhone: candidateForm.motherPhone.trim(),
      parentInfo,
      parentPhone,
      address: candidateForm.address.trim(),
      learningGoals: normalizeList(candidateForm.learningGoals),
      otherLearningGoal: candidateForm.otherLearningGoal.trim(),
      englishExperience: normalizeList(candidateForm.englishExperience),
      previousEnglishCenter: candidateForm.previousEnglishCenter.trim(),
      learningStyles: normalizeList(candidateForm.learningStyles),
      registrationCourse: candidateForm.registrationCourse.trim(),
      registrationShift: candidateForm.registrationShift.trim(),
      registrationDays: candidateForm.registrationDays.trim(),
      registrationTuition: candidateForm.registrationTuition.trim(),
      registrationNote: candidateForm.registrationNote.trim(),
      desiredCourses: splitList(candidateForm.desiredCourses),
      freeSchedule: candidateForm.freeSchedule.trim(),
      callCount: editingCandidateId ? Math.max(0, Number(candidateForm.callCount) || 0) : 0,
    }

    setCandidates((current) => {
      if (!editingCandidateId) return [savedCandidate, ...current]

      return current.map((candidate) => (candidate.id === editingCandidateId ? savedCandidate : candidate))
    })

    if (candidateForm.appointmentDateTime) {
      const { date, time } = splitDateTime(candidateForm.appointmentDateTime)
      addAppointment({
        date,
        time,
        customer: savedCandidate.name,
        type: candidateForm.appointmentType,
        room: candidateForm.appointmentRoom.trim(),
        status: candidateForm.appointmentStatus,
        phone: savedCandidate.parentPhone,
        customerId: savedCandidate.customerId,
        candidateId: savedCandidate.id,
      })
      toast.success('Đã tạo lịch hẹn cho ứng viên.')
    }

    setCandidateForm(emptyCandidateForm)
    setEditingCandidateId(null)
    setShowForm(false)
    toast.success(editingCandidateId ? 'Đã cập nhật ứng viên.' : 'Đã thêm ứng viên mới.')
  }

  const handleImportFile = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    try {
      const text = await file.text()
      const rawCandidates = file.name.toLowerCase().endsWith('.json') ? JSON.parse(text) : parseCsv(text)
      const importedCandidates = (Array.isArray(rawCandidates) ? rawCandidates : [rawCandidates])
        .map((candidate, index) => ({ ...normalizeImportedCandidate(candidate), id: `${createCandidateId()}-${index}` }))
        .filter((candidate) => candidate.name && candidate.parentInfo && candidate.parentPhone)

      if (!importedCandidates.length) {
        toast.error('File import không có ứng viên hợp lệ.')
        return
      }

      setCandidates((current) => [...importedCandidates, ...current])
      toast.success(`Đã import ${importedCandidates.length} ứng viên.`)
    } catch {
      toast.error('Không thể đọc file. Vui lòng kiểm tra định dạng CSV hoặc JSON.')
    }
  }

  const handleCreateCandidate = () => {
    setCandidateForm(emptyCandidateForm)
    setEditingCandidateId(null)
    setShowForm(true)
  }

  const handleEditCandidate = (candidate) => {
    setCandidateForm(toCandidateForm(candidate))
    setEditingCandidateId(candidate.id)
    setShowForm(true)
  }

  const handleDeleteCandidate = (candidate) => {
    if (!window.confirm(`Xóa ứng viên ${candidate.name}?`)) return

    setCandidates((current) => current.filter((item) => item.id !== candidate.id))
    toast.success('Đã xóa ứng viên.')
  }

  const filteredCandidates = useMemo(
    () =>
      candidates.filter((candidate) => {
        const matchesStatus = statusFilter === 'Tất cả' || candidate.status === statusFilter
        const matchesKeyword = [
          candidate.name,
          candidate.gender,
          candidate.birthYear,
          candidate.school,
          candidate.className,
          normalizeList(candidate.certificates).join(' '),
          candidate.fatherName,
          candidate.fatherPhone,
          candidate.motherName,
          candidate.motherPhone,
          candidate.parentInfo,
          candidate.parentPhone,
          candidate.address,
          normalizeList(candidate.learningGoals).join(' '),
          candidate.otherLearningGoal,
          normalizeList(candidate.englishExperience).join(' '),
          candidate.previousEnglishCenter,
          normalizeList(candidate.learningStyles).join(' '),
          candidate.registrationCourse,
          candidate.registrationShift,
          candidate.registrationDays,
          candidate.registrationTuition,
          candidate.registrationNote,
          normalizeList(candidate.desiredCourses).join(' '),
          candidate.freeSchedule,
          candidate.callCount,
          candidate.status,
        ]
          .join(' ')
          .toLowerCase()
          .includes(keyword.toLowerCase())

        return matchesStatus && matchesKeyword
      }),
    [candidates, keyword, statusFilter],
  )

  return (
    <div className="space-y-5">
      <PotentialCandidatesHeader onImportFile={handleImportFile} onToggleForm={handleCreateCandidate} />
      <PotentialCandidatesSearch keyword={keyword} statusFilter={statusFilter} onKeywordChange={setKeyword} onStatusFilterChange={setStatusFilter} />

      {showForm && (
        <PotentialCandidateForm
          form={candidateForm}
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

      {selectedCandidate && <PotentialCandidateDetailModal candidate={selectedCandidate} onClose={() => setSelectedCandidate(null)} />}

      <PotentialCandidatesTable candidates={filteredCandidates} onDelete={handleDeleteCandidate} onEdit={handleEditCandidate} onView={setSelectedCandidate} />
    </div>
  )
}
