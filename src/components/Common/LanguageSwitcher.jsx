import { useState } from 'react'
import { ChevronDown, Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '../../utils/cn.js'

const languages = [
  { code: 'vi', label: 'VI', title: 'Tiếng Việt' },
  { code: 'en', label: 'EN', title: 'English' },
]

export const LanguageSwitcher = ({ className, showLabel = true }) => {
  const { i18n, t } = useTranslation()
  const [open, setOpen] = useState(false)
  const activeLanguage = languages.find((language) => language.code === i18n.resolvedLanguage) || languages[0]

  const handleLanguageChange = (language) => {
    i18n.changeLanguage(language)
    setOpen(false)
  }

  return (
    <div
      className={cn('relative inline-flex', className)}
      aria-label={t('Ngôn ngữ')}
    >
      <button
        className="inline-flex h-11 items-center gap-2 rounded-2xl border border-orange-100 bg-white px-3 text-sm font-black text-slate-700 shadow-md shadow-orange-950/5 transition hover:border-orange-200 hover:bg-orange-50 focus:outline-none focus:ring-4 focus:ring-orange-100"
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={t('Đổi ngôn ngữ')}
      >
        <Languages size={18} className="text-orange-600" />
        {showLabel && <span>{t('Ngôn ngữ')}</span>}
        <span className="uppercase text-slate-900">{activeLanguage.label}</span>
        <ChevronDown size={16} className={cn('text-slate-600 transition', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 min-w-full overflow-hidden rounded-2xl border border-orange-100 bg-white p-1 shadow-xl shadow-orange-950/10" role="menu">
          {languages.map((language) => (
            <button
              key={language.code}
              className={cn(
                'flex h-10 w-full items-center justify-between gap-3 rounded-xl px-3 text-sm font-black transition',
                i18n.resolvedLanguage === language.code
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-orange-50 hover:text-orange-700',
              )}
              type="button"
              onClick={() => handleLanguageChange(language.code)}
              aria-label={t(language.title)}
              aria-pressed={i18n.resolvedLanguage === language.code}
              role="menuitem"
            >
              <span>{t(language.title)}</span>
              <span>{language.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
