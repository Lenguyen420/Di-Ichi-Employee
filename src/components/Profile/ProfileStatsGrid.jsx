import { Card } from '../Common/Card.jsx'

export const ProfileStatsGrid = ({ stats }) => (
  <div className="grid gap-4 md:grid-cols-4">
    {stats.map((item) => (
      <Card key={item.label} className="rounded-lg">
        <p className="text-sm font-bold text-slate-500">{item.label}</p>
        <p className="mt-2 text-3xl font-black text-slate-950">{item.value}</p>
      </Card>
    ))}
  </div>
)
