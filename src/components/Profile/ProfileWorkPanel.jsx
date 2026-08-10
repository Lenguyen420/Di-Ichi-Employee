import { CalendarDays, KeyRound, PhoneCall, Settings, Trophy } from 'lucide-react'
import { Badge } from '../Common/Badge.jsx'
import { Button } from '../Common/Button.jsx'
import { Card } from '../Common/Card.jsx'

export const ProfileWorkPanel = ({ appointments, calls, customers, tasks }) => (
  <div className="grid gap-5 lg:grid-cols-3">
    <Card className="rounded-lg lg:col-span-2">
      <h2 className="text-lg font-black text-slate-950">Công việc hôm nay</h2>
      <div className="mt-4 space-y-3">
        {tasks.length ? tasks.map((task) => (
          <label key={task.id} className="flex gap-3 rounded-lg border border-orange-100 p-3 text-sm font-semibold text-slate-700">
            <input className="h-4 w-4 accent-orange-600" type="checkbox" />
            {task.content}
          </label>
        )) : (
          <p className="rounded-lg border border-orange-100 p-3 text-sm font-semibold text-slate-500">Chưa có công việc trong dữ liệu mẫu.</p>
        )}
      </div>

      <h2 className="mt-5 text-lg font-black text-slate-950">Khách hàng phụ trách</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {customers.map((customer) => (
          <div key={customer.id} className="rounded-lg border border-orange-100 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-black text-slate-950">{customer.name}</p>
                <p className="mt-1 text-sm font-semibold text-slate-500">{customer.phone} · {customer.source}</p>
              </div>
              <Badge>{customer.level}</Badge>
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-700">Việc tiếp theo: {customer.nextAction}</p>
          </div>
        ))}
      </div>
    </Card>
    <Card className="rounded-lg">
      <h2 className="text-lg font-black text-slate-950">Thành tích & cài đặt</h2>
      <div className="mt-4 space-y-3">
        <p className="flex items-center gap-2 rounded-lg bg-orange-50 p-3 text-sm font-bold text-slate-700"><Trophy size={18} className="text-orange-600" /> Phụ trách {customers.length} khách hàng mẫu</p>
        <p className="flex items-center gap-2 rounded-lg bg-orange-50 p-3 text-sm font-bold text-slate-700"><PhoneCall size={18} className="text-orange-600" /> {calls.length} lịch gọi của Lan Anh</p>
        <p className="flex items-center gap-2 rounded-lg bg-orange-50 p-3 text-sm font-bold text-slate-700"><CalendarDays size={18} className="text-orange-600" /> {appointments.length} lịch hẹn liên quan</p>
        <Button className="w-full" variant="secondary"><KeyRound size={18} /> Đổi mật khẩu</Button>
        <Button className="w-full" variant="ghost"><Settings size={18} /> Cài đặt</Button>
      </div>
    </Card>
  </div>
)
