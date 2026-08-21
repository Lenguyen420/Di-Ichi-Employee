import { CalendarDays, Check, DoorOpen, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '../Common/Badge.jsx'
import { Button } from '../Common/Button.jsx'
import { Card } from '../Common/Card.jsx'

const getClassSeats = (students) => {
  const [current = 0, capacity = 0] = String(students || '0/0').split('/').map((value) => Number(value) || 0)
  return { capacity, current, remaining: Math.max(capacity - current, 0) }
}

export const EnrollmentForm = ({
  availableClasses,
  courses,
  customerName,
  customerOptions,
  discountPercent,
  manualCustomerName,
  recommendationLabel,
  selectedClass,
  selectedClassId,
  selectedCourse,
  selectedCourseCode,
  selectedCustomer,
  selectedCustomerName,
  selectedPotentialCandidate,
  tuitionAfterDiscount,
  onClassChange,
  onCourseChange,
  onCustomerSelectChange,
  onManualCustomerNameChange,
  onSubmit,
}) => {
  const { t } = useTranslation()
  const selectedClassSeats = selectedClass ? getClassSeats(selectedClass.students) : null

  return (
    <Card className="rounded-lg">
      <h2 className="text-lg font-black text-slate-950">{t('Thông tin đăng ký')}</h2>
      <div className="mt-4 space-y-4">
        <Field label={t('Bước 1 - Chọn khách hàng')}>
          <select value={selectedCustomerName} onChange={(event) => onCustomerSelectChange(event.target.value)}>
            {customerOptions.map((option) => <option key={option.id} value={option.name}>{option.name}</option>)}
          </select>
          <input
            className="mt-3"
            placeholder={t('Hoặc nhập tên khách hàng mới')}
            value={manualCustomerName}
            onChange={(event) => onManualCustomerNameChange(event.target.value)}
          />
          <p className="mt-2 text-xs font-semibold text-slate-500">
            {selectedPotentialCandidate
              ? `${selectedPotentialCandidate.parentPhone} · ${t(selectedPotentialCandidate.status)} · ${t('Đề xuất')}: ${recommendationLabel}`
              : selectedCustomer
                ? `${selectedCustomer.phone} · Level ${selectedCustomer.level} · ${t(selectedCustomer.status)}`
                : t('Khách hàng mới: {{name}}', { name: customerName || t('chưa nhập tên') })}
          </p>
        </Field>
        <Field label={t('Bước 2 - Gợi ý khóa học')}>
          <select value={selectedCourseCode} onChange={(event) => onCourseChange(event.target.value)}>
            {courses.map((item) => <option key={item.code} value={item.code}>{item.name} · {item.level}</option>)}
          </select>
        </Field>
        <Field label={t('Bước 3 - Chọn lớp')}>
          <select value={selectedClassId} onChange={(event) => onClassChange(event.target.value)}>
            <option value="">{t('Chọn lớp phù hợp')}</option>
            {availableClasses.map((item) => {
              const seats = getClassSeats(item.students)
              const seatText = seats.remaining > 0 ? t('còn {{count}} chỗ', { count: seats.remaining }) : t('đủ sĩ số')

              return (
                <option key={item.id} value={item.id} disabled={seats.remaining === 0}>
                  {item.name} · {item.schedule} · {t('sĩ số')} {item.students} · {seatText}
                </option>
              )
            })}
          </select>
          {selectedClass ? (
            <div className="mt-3 grid gap-2 rounded-lg border border-orange-100 bg-orange-50/60 p-3 text-sm font-semibold text-slate-700 sm:grid-cols-3">
              <span className="flex items-center gap-2"><CalendarDays size={16} className="text-orange-600" /> {selectedClass.schedule}</span>
              <span className="flex items-center gap-2"><Users size={16} className="text-orange-600" /> {selectedClass.students} · {t('còn {{count}} chỗ', { count: selectedClassSeats.remaining })}</span>
              <span className="flex items-center gap-2"><DoorOpen size={16} className="text-orange-600" /> {selectedClass.room}</span>
            </div>
          ) : (
            <p className="mt-2 text-xs font-semibold text-slate-500">{t('Khóa này chưa có lớp còn khả dụng trong dữ liệu mẫu.')}</p>
          )}
        </Field>
        <Field label={t('Bước 4 - Học phí')}>
          <input value={tuitionAfterDiscount} readOnly />
          <div className="mt-2 flex items-center justify-between gap-3 text-xs font-semibold text-slate-500">
            <span>{t('Học phí gốc')}: {selectedCourse?.tuition || '0đ'}</span>
            <Badge tone={discountPercent ? 'green' : 'slate'}>{discountPercent ? `-${discountPercent}%` : t('Không ưu đãi')}</Badge>
          </div>
        </Field>
        <Button className="w-full" type="button" onClick={onSubmit}><Check size={18} /> {t('Hoàn tất đăng ký')}</Button>
      </div>
    </Card>
  )
}

const Field = ({ label, children }) => (
  <div className="block">
    <span className="text-sm font-black text-slate-700">{label}</span>
    <div className="mt-2 [&_input]:h-11 [&_input]:w-full [&_input]:rounded-lg [&_input]:border [&_input]:border-orange-100 [&_input]:px-3 [&_input]:outline-none [&_input]:focus:border-orange-300 [&_input]:focus:ring-4 [&_input]:focus:ring-orange-100 [&_select]:h-11 [&_select]:w-full [&_select]:rounded-lg [&_select]:border [&_select]:border-orange-100 [&_select]:px-3 [&_select]:outline-none [&_select]:focus:border-orange-300 [&_select]:focus:ring-4 [&_select]:focus:ring-orange-100">
      {children}
    </div>
  </div>
)
