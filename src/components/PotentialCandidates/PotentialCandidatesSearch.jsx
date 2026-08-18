import { RotateCcw, Search } from 'lucide-react'
import { Card } from '../Common/Card.jsx'
import { candidateStatusLabels, candidateStatusOptions } from '../../datas/potentialCandidatesData.js'

export const PotentialCandidatesSearch = ({
  appointmentDateFrom,
  appointmentDateTo,
  genderFilter,
  keyword,
  schoolFilter,
  showStatusFilter = true,
  sortBy,
  sortOrder,
  statusFilter,
  onAppointmentDateFromChange,
  onAppointmentDateToChange,
  onGenderFilterChange,
  onKeywordChange,
  onReset,
  onSchoolFilterChange,
  onSortByChange,
  onSortOrderChange,
  onStatusFilterChange,
  schoolOptions = [],
}) => (
  <Card className="rounded-lg">
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
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
      {showStatusFilter && (
        <FilterField label="Trạng thái">
          <select
            value={statusFilter}
            onChange={(event) => onStatusFilterChange(event.target.value)}
          >
            {candidateStatusOptions.map((status) => <option key={status} value={status}>{candidateStatusLabels[status] || status}</option>)}
          </select>
        </FilterField>
      )}
      <FilterField label="Giới tính">
        <select value={genderFilter} onChange={(event) => onGenderFilterChange(event.target.value)}>
          <option value="">Tất cả</option>
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
          <option value="Khác">Khác</option>
        </select>
      </FilterField>
      <FilterField label="Trường học">
        <select value={schoolFilter} onChange={(event) => onSchoolFilterChange(event.target.value)}>
          <option value="">Tất cả</option>
          {schoolOptions.map((school) => <option key={school} value={school}>{school}</option>)}
        </select>
      </FilterField>
      <FilterField label="Lịch từ ngày">
        <input type="date" value={appointmentDateFrom} onChange={(event) => onAppointmentDateFromChange(event.target.value)} />
      </FilterField>
      <FilterField label="Đến ngày">
        <input type="date" value={appointmentDateTo} onChange={(event) => onAppointmentDateToChange(event.target.value)} />
      </FilterField>
      <FilterField label="Sắp xếp theo">
        <select value={sortBy} onChange={(event) => onSortByChange(event.target.value)}>
          <option value="createdAt">Ngày tạo</option>
          <option value="updatedAt">Ngày cập nhật</option>
          <option value="name">Tên ứng viên</option>
          <option value="code">Mã ứng viên</option>
        </select>
      </FilterField>
      <FilterField label="Thứ tự">
        <select value={sortOrder} onChange={(event) => onSortOrderChange(event.target.value)}>
          <option value="desc">Giảm dần</option>
          <option value="asc">Tăng dần</option>
        </select>
      </FilterField>
    </div>
    <div className="mt-4 flex justify-end">
      <button className="inline-flex items-center gap-2 rounded-lg border border-orange-200 px-3 py-2 text-sm font-bold text-orange-700 transition hover:bg-orange-50" type="button" onClick={onReset}>
        <RotateCcw size={16} /> Xóa bộ lọc
      </button>
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
