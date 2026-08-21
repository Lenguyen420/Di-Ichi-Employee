import { useTranslation } from 'react-i18next'
import { Badge } from '../Common/Badge.jsx'
import { DataTable } from '../Common/DataTable.jsx'

export const PlacementTestsTable = ({ placementTests, onEditStatus }) => {
  const { t } = useTranslation()
  const columns = [
    { header: 'Khách hàng', accessorKey: 'customer' },
    { header: 'Ngày test', accessorKey: 'date' },
    { header: 'Kết quả', accessorKey: 'score' },
    { header: 'Trình độ', cell: ({ row }) => <Badge>{row.original.level}</Badge> },
    { header: 'Gợi ý khóa học', accessorKey: 'recommendation' },
    { header: 'Trạng thái', accessorKey: 'status' },
    {
      header: 'Thao tác',
      cell: ({ row }) => (
        <button className="rounded-lg px-3 py-2 text-sm font-black text-orange-600 transition hover:bg-orange-50 hover:text-orange-700" type="button" onClick={() => onEditStatus(row.original)}>
          {t('Sửa')}
        </button>
      ),
    },
  ]

  return <DataTable columns={columns} data={placementTests} />
}
