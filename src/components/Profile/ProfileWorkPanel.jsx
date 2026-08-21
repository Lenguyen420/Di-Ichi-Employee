import { CalendarDays, KeyRound, PhoneCall, Settings, Trophy } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '../Common/Badge.jsx'
import { Button } from '../Common/Button.jsx'
import { Card } from '../Common/Card.jsx'
import { translateStatic } from '../../i18n/translateStatic.js'

export const ProfileWorkPanel = ({ appointments, calls, customers, tasks }) => {
  const { t } = useTranslation()

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <Card className="rounded-lg lg:col-span-2">
        <h2 className="text-lg font-black text-slate-950">{t('Công việc hôm nay')}</h2>
      <div className="mt-4 space-y-3">
        {tasks.length ? tasks.map((task) => (
          <label key={task.id} className="flex gap-3 rounded-lg border border-orange-100 p-3 text-sm font-semibold text-slate-700">
            <input className="h-4 w-4 accent-orange-600" type="checkbox" />
            {translateStatic(t, task.content)}
          </label>
        )) : (
          <p className="rounded-lg border border-orange-100 p-3 text-sm font-semibold text-slate-500">{t('Chưa có công việc trong dữ liệu mẫu.')}</p>
        )}
      </div>

      <h2 className="mt-5 text-lg font-black text-slate-950">{t('Khách hàng phụ trách')}</h2>
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
            <p className="mt-3 text-sm font-semibold text-slate-700">{t('Việc tiếp theo')}: {translateStatic(t, customer.nextAction)}</p>
          </div>
        ))}
      </div>
    </Card>
    <Card className="rounded-lg">
      <h2 className="text-lg font-black text-slate-950">{t('Thành tích & cài đặt')}</h2>
      <div className="mt-4 space-y-3">
        <p className="flex items-center gap-2 rounded-lg bg-orange-50 p-3 text-sm font-bold text-slate-700"><Trophy size={18} className="text-orange-600" /> {t('Phụ trách {{count}} khách hàng mẫu', { count: customers.length })}</p>
        <p className="flex items-center gap-2 rounded-lg bg-orange-50 p-3 text-sm font-bold text-slate-700"><PhoneCall size={18} className="text-orange-600" /> {t('{{count}} lịch gọi của Lan Anh', { count: calls.length })}</p>
        <p className="flex items-center gap-2 rounded-lg bg-orange-50 p-3 text-sm font-bold text-slate-700"><CalendarDays size={18} className="text-orange-600" /> {t('{{count}} lịch hẹn liên quan', { count: appointments.length })}</p>
        <Button className="w-full" variant="secondary"><KeyRound size={18} /> {t('Đổi mật khẩu')}</Button>
        <Button className="w-full" variant="ghost"><Settings size={18} /> {t('Cài đặt')}</Button>
      </div>
    </Card>
  </div>
  )
}
