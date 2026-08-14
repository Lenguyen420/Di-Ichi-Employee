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
  const [editingResult, setEditingResult] = useState(null)
  const [editingStatus, setEditingStatus] = useState(placementResultStatuses[0])

  const filteredResults = useMemo(
    () => results.filter((item) => item.customer.toLowerCase().includes(searchName.trim().toLowerCase())),
    [results, searchName],
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
        <label className="block">
          <span className="text-sm font-black text-slate-700">Lọc theo tên học sinh</span>
          <div className="relative mt-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              className="h-11 w-full rounded-lg border border-orange-100 px-10 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
              placeholder="Nhập tên học sinh cần tìm"
              value={searchName}
              onChange={(event) => setSearchName(event.target.value)}
            />
          </div>
        </label>
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
