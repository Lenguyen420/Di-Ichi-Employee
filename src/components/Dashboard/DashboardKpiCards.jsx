import { CalendarClock, CheckCircle2, ChevronRight, UsersRound } from 'lucide-react'
import { Badge } from '../Common/Badge.jsx'
import { Card } from '../Common/Card.jsx'

const icons = {
  'new-candidates': UsersRound,
  'today-appointments': CalendarClock,
  'pending-tasks': CheckCircle2,
}

export const DashboardKpiCards = ({ kpis, onSelect }) => (
  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
    {kpis.map((item) => {
      const Icon = icons[item.id]
      return (
        <button key={item.id} className="text-left" type="button" onClick={() => onSelect(item)}>
          <Card className="h-full rounded-lg transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-orange-50 text-orange-600">
                <Icon size={20} />
              </span>
              <Badge tone={item.tone}>{item.change}</Badge>
            </div>
            <p className="mt-5 text-sm font-bold text-slate-500">{item.label}</p>
            <p className="mt-1 text-3xl font-black text-slate-950">{item.value}</p>
            {(item.id === 'new-candidates' || item.id === 'today-appointments') && (
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-black text-orange-600">Xem chi tiết <ChevronRight size={16} /></span>
            )}
          </Card>
        </button>
      )
    })}
  </div>
)
