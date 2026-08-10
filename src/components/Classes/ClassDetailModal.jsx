import { CalendarDays, DoorOpen, GraduationCap, Phone, UserRound, UsersRound, X } from 'lucide-react'
import { Badge } from '../Common/Badge.jsx'
import { Button } from '../Common/Button.jsx'

const parseClassSize = (students) => {
  const [current = 0, capacity = 0] = String(students || '0/0').split('/').map((value) => Number(value) || 0)
  return { capacity, current, remaining: Math.max(capacity - current, 0) }
}

export const ClassDetailModal = ({ classItem, students, onClose }) => {
  if (!classItem) return null

  const seats = parseClassSize(classItem.students)
  const hasSeat = seats.remaining > 0

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/20 p-4">
      <button className="absolute inset-0 cursor-default" type="button" onClick={onClose} aria-label="Đóng popup chi tiết lớp học" />
      <section className="relative z-10 w-full max-w-5xl overflow-hidden rounded-lg border border-orange-100 bg-white shadow-2xl shadow-slate-950/20">
        <div className="flex items-start justify-between gap-4 border-b border-orange-100 px-5 py-4">
          <div>
            <p className="text-sm font-bold text-orange-600">Chi tiết lớp học</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">{classItem.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{classItem.course} · {classItem.teacher}</p>
          </div>
          <Button className="shrink-0" variant="ghost" type="button" onClick={onClose} aria-label="Đóng chi tiết">
            <X size={18} />
          </Button>
        </div>

        <div className="max-h-[72vh] overflow-y-auto p-5">
          <div className="grid gap-3 md:grid-cols-4">
            <Info icon={<GraduationCap size={18} />} label="Khóa học" value={classItem.course} />
            <Info icon={<CalendarDays size={18} />} label="Lịch học" value={classItem.schedule} />
            <Info icon={<UsersRound size={18} />} label="Sĩ số" value={`${classItem.students} · còn ${seats.remaining} chỗ`} />
            <Info icon={<DoorOpen size={18} />} label="Phòng" value={classItem.room} />
          </div>

          <div className="mt-5 rounded-lg border border-orange-100 bg-orange-50/60 p-4">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-lg font-black text-slate-950">Tình trạng lớp</h3>
                <p className="mt-1 text-sm font-semibold text-slate-600">Giáo viên phụ trách: {classItem.teacher}</p>
              </div>
              <Badge tone={hasSeat ? 'orange' : 'green'}>{hasSeat ? `Còn ${seats.remaining} chỗ` : 'Đủ sĩ số'}</Badge>
            </div>
          </div>

          <div className="mt-5">
            <h3 className="text-lg font-black text-slate-950">Danh sách học viên</h3>
            <div className="mt-3 overflow-hidden rounded-lg border border-orange-100">
              <table className="min-w-full divide-y divide-orange-100 text-left text-sm">
                <thead className="bg-orange-50 text-xs uppercase text-orange-700">
                  <tr>
                    <th className="px-4 py-3 font-black">Học viên</th>
                    <th className="px-4 py-3 font-black">SĐT</th>
                    <th className="px-4 py-3 font-black">Trình độ</th>
                    <th className="px-4 py-3 font-black">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-50">
                  {students.length ? students.map((item) => (
                    <tr key={item.id} className="hover:bg-orange-50/60">
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        <span className="inline-flex items-center gap-2"><UserRound size={16} className="text-orange-600" /> {item.student?.name || item.studentId}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        <span className="inline-flex items-center gap-2"><Phone size={16} className="text-orange-600" /> {item.student?.phone || 'Chưa có'}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{item.student?.level || 'Chưa có'}</td>
                      <td className="px-4 py-3"><Badge tone="green">{item.status}</Badge></td>
                    </tr>
                  )) : (
                    <tr>
                      <td className="px-4 py-5 text-center font-semibold text-slate-500" colSpan={4}>Chưa có danh sách học viên mẫu cho lớp này</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

const Info = ({ icon, label, value }) => (
  <div className="rounded-lg border border-orange-100 p-3">
    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-600">{icon}</span>
    <p className="mt-3 text-xs font-black uppercase text-slate-400">{label}</p>
    <p className="mt-1 font-semibold text-slate-800">{value}</p>
  </div>
)
