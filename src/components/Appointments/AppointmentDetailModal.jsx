import { X } from 'lucide-react'
import { Badge } from '../Common/Badge.jsx'
import { Button } from '../Common/Button.jsx'
import { appointmentStatusTone } from './appointmentHelpers.js'

export const AppointmentDetailModal = ({ appointment, onClose }) => (
  <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/20 p-4">
    <button className="absolute inset-0 cursor-default" type="button" onClick={onClose} aria-label="Đóng popup xem lịch hẹn" />
    <section className="relative z-10 w-full max-w-2xl overflow-hidden rounded-lg border border-orange-100 bg-white shadow-2xl shadow-slate-950/20">
      <div className="flex items-start justify-between gap-4 border-b border-orange-100 px-5 py-4">
        <div>
          <p className="text-sm font-bold text-orange-600">Chi tiết lịch hẹn</p>
          <h2 className="mt-1 text-xl font-black text-slate-950">{appointment.customer}</h2>
        </div>
        <Button className="shrink-0" variant="ghost" type="button" onClick={onClose} aria-label="Đóng chi tiết">
          <X size={18} />
        </Button>
      </div>
      <div className="grid gap-3 p-5 md:grid-cols-2">
        <Info label="Ngày" value={appointment.date} />
        <Info label="Giờ" value={appointment.time} />
        <Info label="SĐT phụ huynh" value={appointment.phone} />
        <Info label="Loại lịch hẹn" value={appointment.type} />
        <Info label="Phòng/Kênh" value={appointment.room} />
        <div className="rounded-lg border border-orange-100 p-3">
          <p className="text-xs font-black uppercase text-slate-400">Trạng thái</p>
          <div className="mt-2"><Badge tone={appointmentStatusTone[appointment.status] || 'amber'}>{appointment.status}</Badge></div>
        </div>
      </div>
    </section>
  </div>
)

const Info = ({ label, value }) => (
  <div className="rounded-lg border border-orange-100 p-3">
    <p className="text-xs font-black uppercase text-slate-400">{label}</p>
    <p className="mt-1 font-semibold text-slate-800">{value || 'Chưa cập nhật'}</p>
  </div>
)
