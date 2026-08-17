import { Download, FileUp, Plus } from 'lucide-react'
import { Button } from '../Common/Button.jsx'

export const PotentialCandidatesHeader = ({ onExport, onImportFile, onToggleForm }) => (
  <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
    <div>
      <p className="text-sm font-bold text-orange-600">Ứng viên tiềm năng</p>
      <h1 className="mt-1 text-2xl font-black text-slate-950 md:text-3xl">Danh sách ứng viên</h1>
      <p className="mt-2 text-sm text-slate-500">Quản lý học viên tiềm năng, thông tin phụ huynh, chứng chỉ, khóa học mong muốn và lịch rảnh.</p>
    </div>
    <div className="flex flex-wrap gap-2">
      <Button onClick={onToggleForm}><Plus size={18} /> Thêm mới ứng viên</Button>
      <label className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-orange-700 transition hover:bg-orange-50">
        <FileUp size={18} /> Import
        <input className="sr-only" type="file" accept=".csv,.json,application/json,text/csv" onChange={onImportFile} />
      </label>
      <Button variant="secondary" onClick={onExport}><Download size={18} /> Export</Button>
    </div>
  </div>
)
