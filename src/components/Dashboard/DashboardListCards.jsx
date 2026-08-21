import { ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '../Common/Badge.jsx'
import { Card } from '../Common/Card.jsx'
import { translateStatic } from '../../i18n/translateStatic.js'

export const DashboardListCards = ({ appointments, customers, onOpenAppointments, onOpenCandidates }) => {
  const { t } = useTranslation()

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <Card className="rounded-lg">
        <button className="flex items-center gap-2 text-left text-lg font-black text-slate-950 transition hover:text-orange-700" type="button" onClick={onOpenAppointments}>
          {t('Lịch hẹn hôm nay')}
          <span className="inline-flex items-center gap-1 text-sm font-bold text-orange-600">{t('Xem chi tiết')} <ChevronRight size={16} /></span>
        </button>
        <div className="mt-4 space-y-3">
          {appointments.slice(0, 3).map((item) => (
            <button key={item.id} className="flex w-full items-center justify-between gap-3 rounded-lg bg-orange-50/70 p-3 text-left transition hover:bg-orange-50" type="button" onClick={onOpenAppointments}>
              <div>
                <p className="font-black text-slate-950">{item.time} - {item.customer}</p>
                <p className="text-sm text-slate-500">{translateStatic(t, item.type)} {t('tại')} {item.room}</p>
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-black text-orange-600">{t('Xem chi tiết')} <ChevronRight size={14} /></span>
              </div>
              <Badge tone={item.status === 'Đã xác nhận' ? 'green' : 'amber'}>{translateStatic(t, item.status)}</Badge>
            </button>
          ))}
        </div>
      </Card>

      <Card className="rounded-lg">
        <button className="flex items-center gap-2 text-left text-lg font-black text-slate-950 transition hover:text-orange-700" type="button" onClick={onOpenCandidates}>
          {t('Ứng viên mới')}
          <span className="inline-flex items-center gap-1 text-sm font-bold text-orange-600">{t('Xem chi tiết')} <ChevronRight size={16} /></span>
        </button>
        <div className="mt-4 space-y-3">
          {customers.slice(0, 3).map((item) => (
            <button key={item.id} className="flex w-full items-center justify-between gap-3 rounded-lg border border-orange-100 p-3 text-left transition hover:border-orange-200 hover:bg-orange-50/50" type="button" onClick={onOpenCandidates}>
              <div>
                <p className="font-black text-slate-950">{item.name}</p>
                <p className="text-sm text-slate-500">{item.source} - {translateStatic(t, item.nextAction)}</p>
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-black text-orange-600">{t('Xem chi tiết')} <ChevronRight size={14} /></span>
              </div>
              <Badge>{translateStatic(t, item.status)}</Badge>
            </button>
          ))}
        </div>
      </Card>
    </div>
  )
}
