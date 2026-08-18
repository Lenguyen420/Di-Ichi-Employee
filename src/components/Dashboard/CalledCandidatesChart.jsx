import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Badge } from '../Common/Badge.jsx'
import { Card } from '../Common/Card.jsx'

export const CalledCandidatesChart = ({ data, todayIncrease = 0 }) => (
  <Card className="rounded-lg">
    <div className="mb-4 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-black text-slate-950">Biểu đồ ứng viên đã gọi</h2>
        <p className="text-sm text-slate-500">Số ứng viên đã được gọi theo tháng.</p>
      </div>
      <Badge tone="green">+{todayIncrease}</Badge>
    </div>
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="calledCandidatesFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#fed7aa" strokeDasharray="3 3" />
          <XAxis dataKey="month" stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip />
          <Area dataKey="value" stroke="#ea580c" strokeWidth={3} fill="url(#calledCandidatesFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </Card>
)
