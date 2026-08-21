import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card } from '../Common/Card.jsx'
import { appointmentStatuses, appointmentTypes } from '../../datas/appStaticData.js'
import { allAppointmentsOption } from './appointmentHelpers.js'

export const AppointmentFilters = ({
  dateFrom,
  dateTo,
  keyword,
  statusFilter,
  typeFilter,
  onDateFromChange,
  onDateToChange,
  onKeywordChange,
  onStatusFilterChange,
  onTypeFilterChange,
}) => {
  const { t } = useTranslation()

  return (
    <Card className="rounded-lg">
      <div className="grid gap-3 xl:grid-cols-[minmax(260px,1fr)_170px_170px_170px_180px]">
        <FilterField label={t('Tìm kiếm')}>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-orange-400" size={18} />
            <input className="!pl-10 pr-3" placeholder={t('Tìm theo tên ứng viên, SĐT phụ huynh, phòng, trạng thái...')} value={keyword} onChange={(event) => onKeywordChange(event.target.value)} />
          </div>
        </FilterField>
        <FilterField label={t('Lịch từ ngày')}>
          <input type="date" value={dateFrom} onChange={(event) => onDateFromChange(event.target.value)} />
        </FilterField>
        <FilterField label={t('Đến ngày')}>
          <input type="date" value={dateTo} onChange={(event) => onDateToChange(event.target.value)} />
        </FilterField>
        <FilterField label={t('Trạng thái')}>
          <select value={statusFilter} onChange={(event) => onStatusFilterChange(event.target.value)}>
            {[allAppointmentsOption, ...appointmentStatuses].map((status) => <option key={status} value={status}>{t(status)}</option>)}
          </select>
        </FilterField>
        <FilterField label={t('Loại lịch hẹn')}>
          <select value={typeFilter} onChange={(event) => onTypeFilterChange(event.target.value)}>
            {[allAppointmentsOption, ...appointmentTypes].map((type) => <option key={type} value={type}>{t(type)}</option>)}
          </select>
        </FilterField>
      </div>
    </Card>
  )
}

const FilterField = ({ label, children }) => (
  <label className="block">
    <span className="text-sm font-black text-slate-700">{label}</span>
    <div className="mt-2 [&_input]:h-11 [&_input]:w-full [&_input]:rounded-lg [&_input]:border [&_input]:border-orange-100 [&_input]:px-3 [&_input]:text-sm [&_input]:outline-none [&_input]:transition [&_input]:focus:border-orange-300 [&_input]:focus:ring-4 [&_input]:focus:ring-orange-100 [&_select]:h-11 [&_select]:w-full [&_select]:rounded-lg [&_select]:border [&_select]:border-orange-100 [&_select]:px-3 [&_select]:text-sm [&_select]:outline-none [&_select]:focus:border-orange-300 [&_select]:focus:ring-4 [&_select]:focus:ring-orange-100">
      {children}
    </div>
  </label>
)
