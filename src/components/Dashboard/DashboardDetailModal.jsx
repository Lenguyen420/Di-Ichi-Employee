import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '../Common/Badge.jsx'
import { Button } from '../Common/Button.jsx'
import { translateStatic } from '../../i18n/translateStatic.js'

export const DashboardDetailModal = ({ item, onClose }) => {
  const { t } = useTranslation()

  if (!item) return null

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/20 p-4">
      <button className="absolute inset-0 cursor-default" type="button" onClick={onClose} aria-label={t('Đóng chi tiết')} />
      <section className="relative z-10 w-full max-w-xl overflow-hidden rounded-lg border border-orange-100 bg-white shadow-2xl shadow-slate-950/20">
        <div className="flex items-start justify-between gap-4 border-b border-orange-100 px-5 py-4">
          <div>
            <p className="text-sm font-bold text-orange-600">{t('Chi tiết')}</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">{translateStatic(t, item.label)}</h2>
          </div>
          <Button className="shrink-0" variant="ghost" type="button" onClick={onClose} aria-label={t('Đóng popup')}>
            <X size={18} />
          </Button>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between rounded-lg border border-orange-100 p-4">
            <p className="text-4xl font-black text-slate-950">{item.value}</p>
            <Badge tone={item.tone}>{translateStatic(t, item.change)}</Badge>
          </div>
          <p className="mt-4 text-sm font-semibold leading-6 text-slate-600">{translateStatic(t, item.detail)}</p>
        </div>
      </section>
    </div>
  )
}
