import { Search } from 'lucide-react'
import { Card } from '../Common/Card.jsx'
import { appointmentStatuses, appointmentTypes } from '../../datas/appStaticData.js'
import { allAppointmentsOption } from './appointmentHelpers.js'

export const AppointmentFilters = ({ keyword, statusFilter, typeFilter, onKeywordChange, onStatusFilterChange, onTypeFilterChange }) => (
  <Card className="rounded-lg">
    <div className="grid gap-3 md:grid-cols-[1fr_200px_200px]">
      <FilterField label="Tìm kiếm">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-orange-400" size={18} />
          <input className="!pl-10 pr-3" placeholder="Tìm theo tên ứng viên, SĐT phụ huynh, phòng, trạng thái..." value={keyword} onChange={(event) => onKeywordChange(event.target.value)} />
        </div>
      </FilterField>
      <FilterField label="Trạng thái">
        <select value={statusFilter} onChange={(event) => onStatusFilterChange(event.target.value)}>
          {[allAppointmentsOption, ...appointmentStatuses].map((status) => <option key={status}>{status}</option>)}
        </select>
      </FilterField>
      <FilterField label="Loại lịch hẹn">
        <select value={typeFilter} onChange={(event) => onTypeFilterChange(event.target.value)}>
          {[allAppointmentsOption, ...appointmentTypes].map((type) => <option key={type}>{type}</option>)}
        </select>
      </FilterField>
    </div>
  </Card>
)

const FilterField = ({ label, children }) => (
  <label className="block">
    <span className="text-sm font-black text-slate-700">{label}</span>
    <div className="mt-2 [&_input]:h-11 [&_input]:w-full [&_input]:rounded-lg [&_input]:border [&_input]:border-orange-100 [&_input]:px-3 [&_input]:text-sm [&_input]:outline-none [&_input]:transition [&_input]:focus:border-orange-300 [&_input]:focus:ring-4 [&_input]:focus:ring-orange-100 [&_select]:h-11 [&_select]:w-full [&_select]:rounded-lg [&_select]:border [&_select]:border-orange-100 [&_select]:px-3 [&_select]:text-sm [&_select]:outline-none [&_select]:focus:border-orange-300 [&_select]:focus:ring-4 [&_select]:focus:ring-orange-100">
      {children}
    </div>
  </label>
)
