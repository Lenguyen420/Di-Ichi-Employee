import { RotateCcw, Search } from 'lucide-react'
import { Card } from '../Common/Card.jsx'
import { candidateStatusLabels, candidateStatusOptions } from '../../datas/potentialCandidatesData.js'

export const PotentialCandidatesSearch = ({
  keyword,
  showStatusFilter = true,
  statusFilter,
  onKeywordChange,
  onReset,
  onStatusFilterChange,
}) => (
  <Card className="rounded-lg">
    <div className={showStatusFilter ? 'grid gap-3 lg:grid-cols-[minmax(260px,1fr)_220px]' : 'grid gap-3'}>
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
            {candidateStatusOptions.map((status) => (
              <option key={status} value={status}>{candidateStatusLabels[status] || status}</option>
            ))}
          </select>
        </FilterField>
      )}
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
