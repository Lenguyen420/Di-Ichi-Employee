import { BookOpenCheck, WalletCards } from 'lucide-react'
import { Badge } from '../Common/Badge.jsx'
import { Button } from '../Common/Button.jsx'
import { Card } from '../Common/Card.jsx'

export const CourseCards = ({ courses, onView }) => (
  <div className="grid gap-5 lg:grid-cols-2">
    {courses.map((course) => (
      <Card key={course.code} className="rounded-lg">
        <div className="flex items-start justify-between">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-orange-50 text-orange-600"><BookOpenCheck size={20} /></span>
          <Badge>{course.level}</Badge>
        </div>
        <h2 className="mt-4 text-xl font-black text-slate-950">{course.name}</h2>
        <p className="mt-2 text-sm text-slate-500">Thời lượng {course.duration}, hiện có {course.classes} lớp đang hoặc sắp khai giảng.</p>
        <div className="mt-4 flex items-center justify-between rounded-lg bg-orange-50 p-3">
          <span className="flex items-center gap-2 text-sm font-bold text-slate-600"><WalletCards size={18} /> Học phí</span>
          <strong className="text-slate-950">{course.tuition}</strong>
        </div>
        <Button className="mt-4" variant="secondary" type="button" onClick={() => onView(course)}>Xem chi tiết khóa học</Button>
      </Card>
    ))}
  </div>
)
