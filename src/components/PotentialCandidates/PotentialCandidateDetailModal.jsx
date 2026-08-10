import { X } from 'lucide-react'
import { Badge } from '../Common/Badge.jsx'
import { Button } from '../Common/Button.jsx'
import { candidateStatusTone } from './candidateConstants.js'

export const PotentialCandidateDetailModal = ({ candidate, onClose }) => {
  if (!candidate) return null

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/20 p-4">
      <button className="absolute inset-0 cursor-default" type="button" onClick={onClose} aria-label="Đóng popup xem ứng viên" />
      <section className="relative z-10 w-full max-w-3xl overflow-hidden rounded-lg border border-orange-100 bg-white shadow-2xl shadow-slate-950/20">
        <div className="flex items-start justify-between gap-4 border-b border-orange-100 px-5 py-4">
          <div>
            <p className="text-sm font-bold text-orange-600">Chi tiết ứng viên</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">{candidate.name}</h2>
          </div>
          <Button className="shrink-0" variant="ghost" type="button" onClick={onClose} aria-label="Đóng chi tiết">
            <X size={18} />
          </Button>
        </div>
        <div className="grid max-h-[70vh] gap-3 overflow-y-auto p-5 md:grid-cols-2">
          <Info label="Giới tính" value={candidate.gender} />
          <Info label="Trường" value={candidate.school} />
          <Info label="Lớp" value={candidate.className} />
          <Info label="Tên phụ huynh" value={candidate.parentInfo} />
          <Info label="SĐT phụ huynh" value={candidate.parentPhone} />
          <Info label="Địa chỉ nhà ở" value={candidate.address} />
          <Info label="Lịch rảnh" value={candidate.freeSchedule} />
          <div className="rounded-lg border border-orange-100 p-3">
            <p className="text-xs font-black uppercase text-slate-400">Trạng thái</p>
            <div className="mt-2"><Badge tone={candidateStatusTone[candidate.status]}>{candidate.status}</Badge></div>
          </div>
          <TagInfo label="Chứng chỉ đang có" items={candidate.certificates} tone="slate" />
          <TagInfo label="Khóa học mong muốn" items={candidate.desiredCourses} />
        </div>
      </section>
    </div>
  )
}

const Info = ({ label, value }) => (
  <div className="rounded-lg border border-orange-100 p-3">
    <p className="text-xs font-black uppercase text-slate-400">{label}</p>
    <p className="mt-1 font-semibold text-slate-800">{value || 'Chưa cập nhật'}</p>
  </div>
)

const TagInfo = ({ label, items, tone }) => (
  <div className="rounded-lg border border-orange-100 p-3 md:col-span-2">
    <p className="text-xs font-black uppercase text-slate-400">{label}</p>
    <div className="mt-2 flex flex-wrap gap-1.5">
      {(items?.length ? items : ['Chưa cập nhật']).map((item) => <Badge key={item} tone={tone}>{item}</Badge>)}
    </div>
  </div>
)
