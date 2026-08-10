import { Eye, Pencil, Trash2 } from 'lucide-react'
import { Badge } from '../Common/Badge.jsx'
import { DataTable } from '../Common/DataTable.jsx'
import { candidateStatusTone } from './candidateConstants.js'

export const PotentialCandidatesTable = ({ candidates, onDelete, onEdit, onView }) => {
  const columns = [
    { header: 'STT', cell: ({ row }) => row.index + 1 },
    { header: 'Tên', accessorKey: 'name' },
    { header: 'Giới tính', accessorKey: 'gender' },
    { header: 'Trường', accessorKey: 'school' },
    { header: 'Lớp', accessorKey: 'className' },
    {
      header: 'Chứng chỉ đang có',
      cell: ({ row }) => (
        <div className="flex min-w-44 flex-wrap gap-1.5">
          {row.original.certificates.map((certificate) => <Badge key={certificate} tone="slate">{certificate}</Badge>)}
        </div>
      ),
    },
    { header: 'Thông tin phụ huynh', accessorKey: 'parentInfo' },
    { header: 'SĐT phụ huynh', accessorKey: 'parentPhone' },
    { header: 'Địa chỉ nhà ở', accessorKey: 'address' },
    {
      header: 'Khóa học mong muốn',
      cell: ({ row }) => (
        <div className="flex min-w-52 flex-wrap gap-1.5">
          {row.original.desiredCourses.map((course) => <Badge key={course}>{course}</Badge>)}
        </div>
      ),
    },
    { header: 'Lịch rảnh', accessorKey: 'freeSchedule' },
    { header: 'Số lần gọi', cell: ({ row }) => row.original.callCount ?? 0 },
    { header: 'Trạng thái', cell: ({ row }) => <Badge tone={candidateStatusTone[row.original.status]}>{row.original.status}</Badge> },
    {
      header: 'Thao tác',
      cell: ({ row }) => (
        <div className="flex min-w-28 items-center gap-1">
          <button className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition hover:bg-orange-50 hover:text-orange-700" type="button" onClick={() => onView(row.original)} aria-label="Xem ứng viên">
            <Eye size={16} />
          </button>
          <button className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition hover:bg-orange-50 hover:text-orange-700" type="button" onClick={() => onEdit(row.original)} aria-label="Sửa ứng viên">
            <Pencil size={16} />
          </button>
          <button className="grid h-8 w-8 place-items-center rounded-lg text-rose-500 transition hover:bg-rose-50 hover:text-rose-700" type="button" onClick={() => onDelete(row.original)} aria-label="Xóa ứng viên">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ]

  return <DataTable columns={columns} data={candidates} />
}
