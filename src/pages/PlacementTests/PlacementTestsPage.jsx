import { useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '../../components/Common/Button.jsx'
import { Card } from '../../components/Common/Card.jsx'
import { PlacementTestsTable } from '../../components/PlacementTests/PlacementTestsTable.jsx'
import { placementResultStatuses } from '../../datas/appStaticData.js'
import { placementTests } from '../../datas/employeePortalData.js'

export const PlacementTestsPage = () => {
  const [results, setResults] = useState(placementTests)
  const [searchName, setSearchName] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [editingResult, setEditingResult] = useState(null)
  const [editingStatus, setEditingStatus] = useState(placementResultStatuses[0])

  const filteredResults = useMemo(
    () => results.filter((item) => {
      const matchesName = item.customer.toLowerCase().includes(searchName.trim().toLowerCase())
      const matchesDateFrom = !dateFrom || item.date >= dateFrom
      const matchesDateTo = !dateTo || item.date <= dateTo

      return matchesName && matchesDateFrom && matchesDateTo
    }),
    [dateFrom, dateTo, results, searchName],
  )

  const openEditStatus = (result) => {
    setEditingResult(result)
    setEditingStatus(result.status)
  }

  const saveResultStatus = () => {
    if (!editingResult) return

    setResults((current) => current.map((result) => (
      result.id === editingResult.id ? { ...result, status: editingStatus } : result
    )))
    setEditingResult(null)
    toast.success('Đã cập nhật trạng thái kết quả test.')
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-bold text-orange-600">Kiểm tra đầu vào</p>
        <h1 className="mt-1 text-2xl font-black text-slate-950 md:text-3xl">Danh sách kết quả test</h1>
        <p className="mt-2 text-sm text-slate-500">Lưu và theo dõi kết quả kiểm tra đầu vào, trình độ, gợi ý khóa học và trạng thái tư vấn.</p>
      </div>

      <Card className="rounded-lg">
        <div className="grid gap-3 lg:grid-cols-[minmax(260px,1fr)_180px_180px]">
          <FilterField label="Lọc theo tên học sinh">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                className="!pl-10"
                placeholder="Nhập tên học sinh cần tìm"
                value={searchName}
                onChange={(event) => setSearchName(event.target.value)}
              />
            </div>
          </FilterField>
          <FilterField label="Từ ngày">
            <input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} />
          </FilterField>
          <FilterField label="Đến ngày">
            <input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} />
          </FilterField>
        </div>
      </Card>

      <PlacementTestsTable placementTests={filteredResults} onEditStatus={openEditStatus} />

      {editingResult && (
        <EditStatusModal
          result={editingResult}
          status={editingStatus}
          statuses={placementResultStatuses}
          onChange={setEditingStatus}
          onClose={() => setEditingResult(null)}
          onSave={saveResultStatus}
        />
      )}
    </div>
  )
}

const FilterField = ({ children, label }) => (
  <label className="block">
    <span className="text-sm font-black text-slate-700">{label}</span>
    <div className="mt-2 [&_input]:h-11 [&_input]:w-full [&_input]:rounded-lg [&_input]:border [&_input]:border-orange-100 [&_input]:px-3 [&_input]:text-sm [&_input]:outline-none [&_input]:transition [&_input]:focus:border-orange-300 [&_input]:focus:ring-4 [&_input]:focus:ring-orange-100">
      {children}
    </div>
  </label>
)

const EditStatusModal = ({ result, status, statuses, onChange, onClose, onSave }) => (
  <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/20 p-4">
    <button className="absolute inset-0 cursor-default" type="button" onClick={onClose} aria-label="Đóng sửa trạng thái" />
    <section className="relative z-10 w-full max-w-md rounded-lg border border-orange-100 bg-white p-5 shadow-2xl shadow-slate-950/20">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-orange-600">Kết quả test</p>
          <h2 className="mt-1 text-lg font-black text-slate-950">{result.customer}</h2>
          <p className="mt-1 text-sm text-slate-500">{result.score} · {result.level} · {result.recommendation}</p>
        </div>
        <Button className="shrink-0" variant="ghost" type="button" onClick={onClose} aria-label="Đóng">
          <X size={18} />
        </Button>
      </div>
      <label className="mt-5 block">
        <span className="text-sm font-black text-slate-700">Trạng thái</span>
        <select
          className="mt-2 h-11 w-full rounded-lg border border-orange-100 px-3 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
          value={status}
          onChange={(event) => onChange(event.target.value)}
        >
          {statuses.map((item) => <option key={item}>{item}</option>)}
        </select>
      </label>
      <div className="mt-5 flex justify-end gap-3">
        <Button variant="ghost" type="button" onClick={onClose}>Hủy</Button>
        <Button type="button" onClick={onSave}>Lưu trạng thái</Button>
      </div>
    </section>
  </div>
)
