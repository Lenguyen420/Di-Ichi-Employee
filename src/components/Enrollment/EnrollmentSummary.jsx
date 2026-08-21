import { ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '../Common/Badge.jsx'
import { Card } from '../Common/Card.jsx'

const getClassSeats = (students) => {
  const [current = 0, capacity = 0] = String(students || '0/0').split('/').map((value) => Number(value) || 0)
  return { capacity, current, remaining: Math.max(capacity - current, 0) }
}

export const EnrollmentSummary = ({
  customerName,
  discountPercent,
  recommendationLabel,
  selectedClass,
  selectedCourse,
  selectedCustomer,
  selectedPotentialCandidate,
  tuitionAfterDiscount,
}) => {
  const { t } = useTranslation()
  const classSeats = selectedClass ? getClassSeats(selectedClass.students) : null

  return (
    <Card className="rounded-lg">
      <h2 className="text-lg font-black text-slate-950">{t('Tóm tắt đề xuất')}</h2>
      <div className="mt-4 space-y-3">
        <Summary label={t('Khách hàng')} value={customerName || t('Chưa chọn')} badge={selectedCustomer?.level || t(selectedPotentialCandidate?.status || 'Mới')} />
        <Summary label={t('Thông tin đề xuất')} value={recommendationLabel} badge={selectedPotentialCandidate ? t('Ứng viên tiềm năng') : selectedCourse ? t('Khách hàng') : t('Chờ chọn')} />
        <Summary label={t('Khóa học phù hợp')} value={selectedCourse?.name || t('Chưa chọn khóa')} badge={selectedCourse ? t('Gợi ý tốt nhất') : t('Chờ chọn')} />
        <Summary
          label={t('Lớp khả dụng')}
          value={selectedClass ? `${selectedClass.name} · ${selectedClass.schedule}` : t('Chưa có lớp')}
          badge={classSeats ? t('Còn {{count}} chỗ', { count: classSeats.remaining }) : t('Chưa chọn')}
        />
        <Summary label={t('Học phí sau ưu đãi')} value={tuitionAfterDiscount} badge={discountPercent ? `-${discountPercent}%` : t('Giá gốc')} />
      </div>
    </Card>
  )
}

const Summary = ({ label, value, badge }) => (
  <div className="grid min-h-[74px] items-center gap-3 rounded-lg border border-orange-100 p-3 sm:grid-cols-[150px_minmax(0,1fr)_128px_20px]">
    <div className="sm:col-span-2 sm:grid sm:grid-cols-[150px_minmax(0,1fr)] sm:items-center sm:gap-3">
      <p className="text-xs font-black uppercase text-slate-400">{label}</p>
      <p className="mt-1 min-w-0 font-black text-slate-950 sm:mt-0">{value}</p>
    </div>
    <span className="justify-self-start sm:justify-self-end"><Badge tone="green">{badge}</Badge></span>
    <ChevronRight size={16} className="hidden text-orange-500 sm:block" />
  </div>
)
