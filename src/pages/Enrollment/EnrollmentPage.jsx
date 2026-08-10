import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { EnrollmentForm } from '../../components/Enrollment/EnrollmentForm.jsx'
import { EnrollmentSteps } from '../../components/Enrollment/EnrollmentSteps.jsx'
import { EnrollmentSummary } from '../../components/Enrollment/EnrollmentSummary.jsx'
import { availableStudents, classes, courses, customers } from '../../datas/employeePortalData.js'
import { potentialCandidates } from '../../datas/potentialCandidatesData.js'

const steps = ['Chọn khách hàng', 'Gợi ý khóa học', 'Chọn lớp', 'Học phí', 'Hoàn tất đăng ký']

const parseVnd = (value) => Number(String(value).replace(/[^\d]/g, '')) || 0

const formatVnd = (value) => `${new Intl.NumberFormat('vi-VN').format(value)}đ`

const normalizeText = (value) => String(value || '').trim().toLowerCase()

const findRecommendedCourseCode = (candidate, customer) => {
  const studentRecommendation = availableStudents.find(
    (student) => student.candidateId === candidate?.id || student.customerId === customer?.id,
  )

  if (studentRecommendation?.recommendedCourseCode) return studentRecommendation.recommendedCourseCode

  const desiredCourse = candidate?.desiredCourses?.find((desiredName) => (
    courses.some((course) => normalizeText(course.name) === normalizeText(desiredName))
  ))

  return courses.find((course) => normalizeText(course.name) === normalizeText(desiredCourse))?.code || ''
}

export const EnrollmentPage = () => {
  const [selectedCustomerName, setSelectedCustomerName] = useState(customers[0]?.name || '')
  const [manualCustomerName, setManualCustomerName] = useState('')
  const customerName = manualCustomerName.trim() || selectedCustomerName
  const selectedCustomer = useMemo(
    () => customers.find((customer) => customer.name.toLowerCase() === customerName.trim().toLowerCase()) || null,
    [customerName],
  )
  const selectedPotentialCandidate = useMemo(
    () => potentialCandidates.find((candidate) => normalizeText(candidate.name) === normalizeText(customerName)) || null,
    [customerName],
  )
  const recommendedStudent = useMemo(
    () => availableStudents.find((student) => (
      student.customerId === selectedCustomer?.id || student.candidateId === selectedPotentialCandidate?.id
    )) || null,
    [selectedCustomer, selectedPotentialCandidate],
  )
  const customerOptions = useMemo(() => {
    const names = [...new Set([...customers.map((customer) => customer.name), ...potentialCandidates.map((candidate) => candidate.name)])]

    return names.map((name) => {
      const customer = customers.find((item) => normalizeText(item.name) === normalizeText(name))
      const candidate = potentialCandidates.find((item) => normalizeText(item.name) === normalizeText(name))
      const details = [
        customer ? `Khách hàng · ${customer.phone} · Level ${customer.level}` : null,
        candidate ? `Ứng viên tiềm năng · ${candidate.parentPhone} · ${candidate.status}` : null,
      ].filter(Boolean)

      return {
        id: customer?.id || candidate?.id || name,
        meta: details.join(' | '),
        name,
      }
    })
  }, [])
  const initialCourseCode = recommendedStudent?.recommendedCourseCode || findRecommendedCourseCode(selectedPotentialCandidate, selectedCustomer) || courses[0]?.code || ''
  const [selectedCourseCode, setSelectedCourseCode] = useState(initialCourseCode)
  const availableClasses = useMemo(
    () => classes.filter((classItem) => classItem.courseCode === selectedCourseCode),
    [selectedCourseCode],
  )
  const [selectedClassId, setSelectedClassId] = useState(classes.find((classItem) => classItem.courseCode === initialCourseCode)?.id || '')
  const selectedCourse = courses.find((course) => course.code === selectedCourseCode) || null
  const selectedClass = classes.find((classItem) => classItem.id === selectedClassId) || null
  const recommendationLabel = selectedPotentialCandidate?.desiredCourses?.join(', ') || selectedCourse?.name || 'Chưa có đề xuất'
  const discountPercent = selectedCustomer || selectedPotentialCandidate ? 5 : 0
  const tuitionAfterDiscount = selectedCourse ? formatVnd(Math.round(parseVnd(selectedCourse.tuition) * (100 - discountPercent) / 100)) : '0đ'

  const applyCustomerRecommendation = (value) => {
    const matchedCustomer = customers.find((customer) => normalizeText(customer.name) === normalizeText(value))
    const matchedCandidate = potentialCandidates.find((candidate) => normalizeText(candidate.name) === normalizeText(value))
    const matchedStudent = availableStudents.find((student) => (
      student.customerId === matchedCustomer?.id || student.candidateId === matchedCandidate?.id
    ))
    const nextCourseCode = matchedStudent?.recommendedCourseCode || findRecommendedCourseCode(matchedCandidate, matchedCustomer) || selectedCourseCode
    const nextClassId = classes.find((classItem) => classItem.courseCode === nextCourseCode)?.id || ''

    if (matchedStudent?.recommendedCourseCode || matchedCandidate) {
      setSelectedCourseCode(nextCourseCode)
      setSelectedClassId(nextClassId)
    }
  }

  const handleCustomerSelectChange = (value) => {
    setSelectedCustomerName(value)
    setManualCustomerName('')
    applyCustomerRecommendation(value)
  }

  const handleManualCustomerNameChange = (value) => {
    setManualCustomerName(value)
    applyCustomerRecommendation(value)
  }

  const handleCourseChange = (courseCode) => {
    setSelectedCourseCode(courseCode)
    setSelectedClassId(classes.find((classItem) => classItem.courseCode === courseCode)?.id || '')
  }

  const handleSubmit = () => {
    if (!customerName.trim()) {
      toast.error('Vui lòng nhập hoặc chọn khách hàng.')
      return
    }

    if (!selectedCourse) {
      toast.error('Vui lòng chọn khóa học.')
      return
    }

    if (!selectedClass) {
      toast.error('Vui lòng chọn lớp còn khả dụng.')
      return
    }

    toast.success(`Đã đăng ký ${customerName.trim()} vào lớp ${selectedClass.name}.`)
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-bold text-orange-600">Đăng ký khóa học</p>
        <h1 className="mt-1 text-2xl font-black text-slate-950 md:text-3xl">Quy trình đăng ký 5 bước</h1>
        <p className="mt-2 text-sm text-slate-500">Từ chọn khách hàng, gợi ý khóa học, chọn lớp, tính học phí đến hoàn tất đăng ký.</p>
      </div>

      <EnrollmentSteps steps={steps} />

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <EnrollmentForm
          availableClasses={availableClasses}
          courses={courses}
          customerName={customerName}
          customerOptions={customerOptions}
          discountPercent={discountPercent}
          manualCustomerName={manualCustomerName}
          recommendationLabel={recommendationLabel}
          selectedClass={selectedClass}
          selectedClassId={selectedClassId}
          selectedCourse={selectedCourse}
          selectedCourseCode={selectedCourseCode}
          selectedCustomer={selectedCustomer}
          selectedCustomerName={selectedCustomerName}
          selectedPotentialCandidate={selectedPotentialCandidate}
          tuitionAfterDiscount={tuitionAfterDiscount}
          onClassChange={setSelectedClassId}
          onCourseChange={handleCourseChange}
          onCustomerSelectChange={handleCustomerSelectChange}
          onManualCustomerNameChange={handleManualCustomerNameChange}
          onSubmit={handleSubmit}
        />
        <EnrollmentSummary
          customerName={customerName}
          discountPercent={discountPercent}
          recommendationLabel={recommendationLabel}
          selectedClass={selectedClass}
          selectedCourse={selectedCourse}
          selectedCustomer={selectedCustomer}
          selectedPotentialCandidate={selectedPotentialCandidate}
          tuitionAfterDiscount={tuitionAfterDiscount}
        />
      </div>
    </div>
  )
}
