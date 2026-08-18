import { Search } from 'lucide-react'
import { Card } from '../Common/Card.jsx'
import { candidateStatusOptions } from '../../datas/potentialCandidatesData.js'

export const PotentialCandidatesSearch = ({
  appointmentDateFrom,
  appointmentDateTo,
  keyword,
  statusFilter,
  onAppointmentDateFromChange,
  onAppointmentDateToChange,
  onKeywordChange,
  onStatusFilterChange,
}) => (
  <Card className="rounded-lg">
    <div className="grid gap-3 lg:grid-cols-[minmax(260px,1fr)_180px_180px_180px]">
      <FilterField label="Tìm kiếm" className="xl:min-w-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400" size={18} />
          <input
            className="!pl-10"
            value={keyword}
            onChange={(event) => onKeywordChange(event.target.value)}
            placeholder="Tìm tên, trường, phụ huynh, địa chỉ, khóa học..."
          />
        </div>
      </FilterField>
      <FilterField label="Trạng thái">
        <select
          value={statusFilter}
          onChange={(event) => onStatusFilterChange(event.target.value)}
        >
          {candidateStatusOptions.map((status) => <option key={status}>{status}</option>)}
        </select>
      </FilterField>
      <FilterField label="Lịch từ ngày">
        <input type="date" value={appointmentDateFrom} onChange={(event) => onAppointmentDateFromChange(event.target.value)} />
      </FilterField>
      <FilterField label="Đến ngày">
        <input type="date" value={appointmentDateTo} onChange={(event) => onAppointmentDateToChange(event.target.value)} />
      </FilterField>
    </div>
  </Card>
)

const FilterField = ({ children, className = '', label }) => (
  <label className={`block ${className}`.trim()}>
    <span className="text-sm font-black text-slate-700">{label}</span>
    <div className="mt-2 [&_input]:h-11 [&_input]:w-full [&_input]:rounded-lg [&_input]:border [&_input]:border-orange-100 [&_input]:px-3 [&_input]:text-sm [&_input]:outline-none [&_input]:transition [&_input]:focus:border-orange-300 [&_input]:focus:ring-4 [&_input]:focus:ring-orange-100 [&_select]:h-11 [&_select]:w-full [&_select]:rounded-lg [&_select]:border [&_select]:border-orange-100 [&_select]:px-3 [&_select]:text-sm [&_select]:font-semibold [&_select]:text-slate-700 [&_select]:outline-none [&_select]:transition [&_select]:focus:border-orange-300 [&_select]:focus:ring-4 [&_select]:focus:ring-orange-100">
      {children}
    </div>
  </label>
)
