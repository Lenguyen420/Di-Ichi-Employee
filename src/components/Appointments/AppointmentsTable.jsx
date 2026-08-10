import { Eye, Pencil, Trash2 } from 'lucide-react'
import { Badge } from '../Common/Badge.jsx'
import { DataTable } from '../Common/DataTable.jsx'
import { appointmentStatusTone } from './appointmentHelpers.js'

export const AppointmentsTable = ({ appointments, onDelete, onEdit, onView }) => {
  const columns = [
    { header: 'Ngày', accessorKey: 'date' },
    { header: 'Giờ', accessorKey: 'time' },
    { header: 'Khách hàng', accessorKey: 'customer' },
    { header: 'SĐT', cell: ({ row }) => row.original.phone || 'Chưa cập nhật' },
    { header: 'Loại lịch hẹn', accessorKey: 'type' },
    { header: 'Phòng/Kênh', accessorKey: 'room' },
    { header: 'Trạng thái', cell: ({ row }) => <Badge tone={appointmentStatusTone[row.original.status] || 'amber'}>{row.original.status}</Badge> },
    {
      header: 'Thao tác',
      cell: ({ row }) => (
        <div className="flex min-w-28 items-center gap-1">
          <button className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition hover:bg-orange-50 hover:text-orange-700" type="button" onClick={() => onView(row.original)} aria-label="Xem lịch hẹn">
            <Eye size={16} />
          </button>
          <button className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition hover:bg-orange-50 hover:text-orange-700" type="button" onClick={() => onEdit(row.original)} aria-label="Sửa lịch hẹn">
            <Pencil size={16} />
          </button>
          <button className="grid h-8 w-8 place-items-center rounded-lg text-rose-500 transition hover:bg-rose-50 hover:text-rose-700" type="button" onClick={() => onDelete(row.original)} aria-label="Xóa lịch hẹn">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ]

  return <DataTable columns={columns} data={appointments} />
}
