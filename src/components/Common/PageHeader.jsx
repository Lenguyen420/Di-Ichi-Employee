import { Button } from './Button.jsx'

export const PageHeader = ({ title, description, action, icon: Icon }) => (
  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
    <div>
      <p className="text-sm font-bold text-orange-600">Di-Ichi Employee Portal</p>
      <h1 className="mt-1 text-2xl font-black text-slate-950 md:text-3xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-500">{description}</p>
    </div>
    {action && (
      <Button>
        {Icon && <Icon size={18} />}
        {action}
      </Button>
    )}
  </div>
)
