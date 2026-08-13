import { Search } from 'lucide-react'
import { Card } from '../Common/Card.jsx'
import { candidateStatusOptions } from '../../datas/potentialCandidatesData.js'

export const PotentialCandidatesSearch = ({ keyword, statusFilter, onKeywordChange, onStatusFilterChange }) => (
  <Card className="rounded-lg">
    <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
      <label className="block">
        <span className="text-sm font-black text-slate-700">Tìm kiếm</span>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400" size={18} />
          <input
            className="h-11 w-full rounded-lg border border-orange-100 pl-10 pr-3 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
            value={keyword}
            onChange={(event) => onKeywordChange(event.target.value)}
            placeholder="Tìm tên, trường, phụ huynh, địa chỉ, khóa học..."
          />
        </div>
      </label>
      <label className="block">
        <span className="text-sm font-black text-slate-700">Trạng thái</span>
        <select
          className="mt-2 h-11 w-full rounded-lg border border-orange-100 px-3 text-sm font-semibold text-slate-700 outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
          value={statusFilter}
          onChange={(event) => onStatusFilterChange(event.target.value)}
        >
          {candidateStatusOptions.map((status) => <option key={status}>{status}</option>)}
        </select>
      </label>
    </div>
  </Card>
)
