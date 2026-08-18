import { GraduationCap, PauseCircle, UserRoundX, UsersRound } from 'lucide-react'
import { cn } from '../../utils/cn.js'

const icons = {
  lead: UsersRound,
  studying: GraduationCap,
  reserved: PauseCircle,
  stopped: UserRoundX,
}

export const PotentialCandidatesOverviewCards = ({ items, selectedId, onSelect }) => (
  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
    {items.map((item) => {
      const Icon = icons[item.id] || UsersRound
      const isSelected = item.id === selectedId

      return (
        <button
          key={item.id}
          className={cn(
            'rounded-lg border bg-white p-4 text-left shadow-sm transition',
            isSelected ? 'border-orange-300 ring-4 ring-orange-100' : 'border-orange-100 hover:border-orange-200 hover:bg-orange-50/40',
          )}
          type="button"
          onClick={() => onSelect(item.id)}
          aria-pressed={isSelected}
        >
          <div className="flex items-start justify-between gap-3">
            <span className={cn('grid h-10 w-10 place-items-center rounded-lg', item.iconClassName)}>
              <Icon size={20} />
            </span>
            <span className="text-2xl font-black text-slate-950">{item.count}</span>
          </div>
          <p className="mt-3 text-sm font-black text-slate-800">{item.label}</p>
          <p className="mt-1 text-xs font-semibold text-slate-500">{item.description}</p>
        </button>
      )
    })}
  </div>
)
