import { BellRing, Clock, X } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { Badge } from '../Common/Badge.jsx'
import { Button } from '../Common/Button.jsx'

export const NotificationDetailModal = ({ notification, onClose }) => {
  const { t } = useTranslation()

  if (!notification) return null

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/25 p-4">
      <button className="absolute inset-0 cursor-default" type="button" onClick={onClose} aria-label={t('Đóng chi tiết thông báo')} />
      <section className="relative z-10 w-full max-w-xl overflow-hidden rounded-lg border border-orange-100 bg-white shadow-2xl shadow-slate-950/20">
        <div className="flex items-start justify-between gap-4 border-b border-orange-100 px-5 py-4">
          <div className="min-w-0">
            <p className="text-sm font-bold text-orange-600">{t('Chi tiết thông báo')}</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">{t(notification.title)}</h2>
          </div>
          <Button className="shrink-0" variant="ghost" type="button" onClick={onClose} aria-label={t('Đóng')}>
            <X size={18} />
          </Button>
        </div>
        <div className="space-y-4 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={notification.tone}>{t(notification.category)}</Badge>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
              <Clock size={13} />
              {t(notification.time)}
            </span>
            {notification.unread && <Badge tone="rose">{t('Chưa đọc')}</Badge>}
          </div>
          <div className="rounded-lg bg-orange-50/70 p-4">
            <div className="mb-3 grid h-11 w-11 place-items-center rounded-lg bg-white text-orange-600 shadow-sm">
              <BellRing size={20} />
            </div>
            <p className="text-sm font-semibold leading-6 text-slate-700">{t(notification.content)}</p>
          </div>
        </div>
      </section>
    </div>,
    document.body,
  )
}
