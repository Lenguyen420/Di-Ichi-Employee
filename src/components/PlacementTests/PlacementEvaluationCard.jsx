import { Sparkles } from 'lucide-react'
import { Button } from '../Common/Button.jsx'
import { Card } from '../Common/Card.jsx'

export const PlacementEvaluationCard = () => (
  <Card className="rounded-lg">
    <div className="flex items-start gap-3">
      <span className="grid h-11 w-11 place-items-center rounded-lg bg-orange-50 text-orange-600"><Sparkles size={20} /></span>
      <div>
        <h2 className="text-lg font-black text-slate-950">Đánh giá trình độ</h2>
        <p className="mt-1 text-sm text-slate-500">Khi nhập điểm, hệ thống gợi ý level và khóa học phù hợp để tư vấn nhanh hơn.</p>
      </div>
    </div>
    <div className="mt-4 grid gap-3 md:grid-cols-4">
      <input className="h-11 rounded-lg border border-orange-100 px-3 text-sm outline-none" placeholder="Tên khách hàng" />
      <input className="h-11 rounded-lg border border-orange-100 px-3 text-sm outline-none" placeholder="Điểm bài test" />
      <select className="h-11 rounded-lg border border-orange-100 px-3 text-sm outline-none"><option>A1</option><option>A2</option><option>B1</option><option>B2</option></select>
      <Button variant="secondary">Gợi ý khóa học</Button>
    </div>
  </Card>
)
