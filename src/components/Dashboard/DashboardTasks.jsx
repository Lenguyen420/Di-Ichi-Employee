import { useTranslation } from 'react-i18next'
import { Card } from '../Common/Card.jsx'
import { translateStatic } from '../../i18n/translateStatic.js'

export const DashboardTasks = ({ tasks }) => {
  const { t } = useTranslation()

  return (
    <Card className="rounded-lg">
      <h2 className="text-lg font-black text-slate-950">{t('Công việc hôm nay')}</h2>
      <div className="mt-4 space-y-3">
        {tasks.map((task) => (
          <label key={task.id} className="flex items-start gap-3 rounded-lg border border-orange-100 p-3 text-sm font-semibold text-slate-700">
            <input className="mt-1 h-4 w-4 rounded border-orange-200 accent-orange-600" type="checkbox" />
            {translateStatic(t, task.content)}
          </label>
        ))}
      </div>
    </Card>
  )
}
