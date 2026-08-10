import { CalendarDays, GraduationCap, UsersRound } from 'lucide-react'
import { Button } from '../Common/Button.jsx'
import { Card } from '../Common/Card.jsx'

export const ClassCards = ({ classes, onView }) => (
  <div className="grid gap-5 lg:grid-cols-3">
    {classes.map((item) => (
      <Card key={item.id} className="rounded-lg">
        <span className="grid h-11 w-11 place-items-center rounded-lg bg-orange-50 text-orange-600"><GraduationCap size={21} /></span>
        <h2 className="mt-4 text-xl font-black text-slate-950">{item.name}</h2>
        <p className="mt-1 text-sm text-slate-500">{item.course}</p>
        <div className="mt-4 space-y-2 text-sm font-semibold text-slate-700">
          <p className="flex items-center gap-2"><UsersRound size={17} className="text-orange-600" /> Danh sách học viên: {item.students}</p>
          <p className="flex items-center gap-2"><CalendarDays size={17} className="text-orange-600" /> Lịch học: {item.schedule}</p>
          <p>Giáo viên: <strong>{item.teacher}</strong></p>
        </div>
        <Button className="mt-4 w-full" variant="secondary" type="button" onClick={() => onView(item)}>Xem chi tiết lớp</Button>
      </Card>
    ))}
  </div>
)
