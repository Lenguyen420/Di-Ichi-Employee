import { useMemo, useState } from 'react'
import { Bell, BellRing, CheckCheck, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '../Common/Badge.jsx'
import { notifications as notificationSeed } from '../../datas/notificationsData.js'
import { cn } from '../../utils/cn.js'
import { NotificationDetailModal } from './NotificationDetailModal.jsx'

export const NotificationCenter = () => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [readIds, setReadIds] = useState(() => {
    try {
      return JSON.parse(window.localStorage.getItem('di-ichi-read-notifications') || '[]')
    } catch {
      return []
    }
  })
  const [selectedNotification, setSelectedNotification] = useState(null)

  const notifications = useMemo(
    () => notificationSeed.map((item) => ({ ...item, unread: item.unread && !readIds.includes(item.id) })),
    [readIds],
  )
  const unreadCount = notifications.filter((item) => item.unread).length

  const markAsRead = (notification) => {
    if (!notification.unread) return

    setReadIds((current) => {
      const next = [...new Set([...current, notification.id])]
      window.localStorage.setItem('di-ichi-read-notifications', JSON.stringify(next))
      return next
    })
  }

  const handleOpenDetail = (notification) => {
    markAsRead(notification)
    setSelectedNotification({ ...notification, unread: false })
    setOpen(false)
  }

  const handleMarkAllAsRead = () => {
    const next = notificationSeed.map((item) => item.id)
    window.localStorage.setItem('di-ichi-read-notifications', JSON.stringify(next))
    setReadIds(next)
  }

  return (
    <div className="relative">
      <button
        className="relative grid h-11 w-11 place-items-center rounded-2xl border border-orange-100 bg-white text-slate-600 shadow-sm transition hover:bg-orange-50 hover:text-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-100"
        aria-label={t('Thông báo')}
        aria-expanded={open}
        aria-haspopup="dialog"
        type="button"
        onClick={() => setOpen((current) => !current)}
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-orange-600 px-1 text-[9px] font-black leading-none text-white ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <section className="absolute right-0 top-full z-50 mt-3 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-orange-100 bg-white shadow-2xl shadow-orange-950/10">
          <div className="flex items-start justify-between gap-3 border-b border-orange-100 bg-orange-50/70 px-4 py-3">
            <div>
              <p className="text-sm font-black text-slate-950">{t('Thông báo')}</p>
              <p className="mt-1 text-xs font-semibold text-slate-500">{t('{{count}} thông báo chưa đọc', { count: unreadCount })}</p>
            </div>
            <button
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-black text-orange-700 transition hover:bg-white"
              type="button"
              onClick={handleMarkAllAsRead}
            >
              <CheckCheck size={14} />
              {t('Đánh dấu đã đọc')}
            </button>
          </div>

          <div className="max-h-[26rem] overflow-y-auto p-2">
            {notifications.map((notification) => (
              <button
                key={notification.id}
                className="group flex w-full items-start gap-3 rounded-lg p-3 text-left transition hover:bg-orange-50"
                type="button"
                onClick={() => handleOpenDetail(notification)}
              >
                <span className={cn(
                  'mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-lg',
                  notification.unread ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500',
                )}
                >
                  <BellRing size={18} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-start justify-between gap-2">
                    <span className="line-clamp-1 text-sm font-black text-slate-950">{t(notification.title)}</span>
                    {notification.unread && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-orange-600" />}
                  </span>
                  <span className="mt-1 line-clamp-2 text-xs font-semibold leading-5 text-slate-500">{t(notification.summary)}</span>
                  <span className="mt-2 flex items-center justify-between gap-2">
                    <Badge tone={notification.tone}>{t(notification.category)}</Badge>
                    <span className="text-xs font-bold text-slate-400">{t(notification.time)}</span>
                  </span>
                </span>
                <ChevronRight size={16} className="mt-3 shrink-0 text-slate-300 transition group-hover:text-orange-500" />
              </button>
            ))}
          </div>
        </section>
      )}

      <NotificationDetailModal notification={selectedNotification} onClose={() => setSelectedNotification(null)} />
    </div>
  )
}
