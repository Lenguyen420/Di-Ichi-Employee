import { useTranslation } from 'react-i18next'
import { DataTable } from '../Common/DataTable.jsx'

export const CoursesTable = ({ courses, onView }) => {
  const { t } = useTranslation()
  const columns = [
    { header: 'Mã khóa', accessorKey: 'code' },
    { header: 'Tên khóa học', accessorKey: 'name' },
    { header: 'Độ tuổi', accessorKey: 'age' },
    { header: 'Cấp độ', accessorKey: 'level' },
    { header: 'Thời lượng', accessorKey: 'duration' },
    { header: 'Chứng chỉ đầu ra', accessorKey: 'certificate' },
    { header: 'Định hướng', accessorKey: 'orientation' },
    { header: 'Học phí', accessorKey: 'tuition' },
    { header: 'Danh sách lớp', accessorKey: 'classes' },
    {
      header: 'Thao tác',
      cell: ({ row }) => (
        <button className="rounded-lg px-3 py-2 text-sm font-black text-orange-600 transition hover:bg-orange-50 hover:text-orange-700" type="button" onClick={() => onView(row.original)}>
          {t('Xem chi tiết')}
        </button>
      ),
    },
  ]

  return <DataTable columns={columns} data={courses} />
}
