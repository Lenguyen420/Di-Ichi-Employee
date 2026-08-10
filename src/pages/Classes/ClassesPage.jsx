import { useMemo, useState } from 'react'
import { LayoutGrid, Table } from 'lucide-react'
import { ClassCards } from '../../components/Classes/ClassCards.jsx'
import { ClassDetailModal } from '../../components/Classes/ClassDetailModal.jsx'
import { ClassesTable } from '../../components/Classes/ClassesTable.jsx'
import { availableStudents, classes, classStudents } from '../../datas/employeePortalData.js'
import { cn } from '../../utils/cn.js'

export const ClassesPage = () => {
  const [viewMode, setViewMode] = useState('table')
  const [selectedClass, setSelectedClass] = useState(null)
  const selectedClassStudents = useMemo(() => {
    if (!selectedClass) return []

    return classStudents
      .filter((classStudent) => classStudent.classId === selectedClass.id)
      .map((classStudent) => ({
        ...classStudent,
        student: availableStudents.find((student) => student.id === classStudent.studentId),
      }))
  }, [selectedClass])

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-bold text-orange-600">Lớp học</p>
          <h1 className="mt-1 text-2xl font-black text-slate-950 md:text-3xl">Danh sách và chi tiết lớp</h1>
          <p className="mt-2 text-sm text-slate-500">Theo dõi danh sách học viên, giáo viên, lịch học và sĩ số.</p>
        </div>
        <div className="inline-flex h-11 w-fit overflow-hidden rounded-lg border border-orange-100 bg-white p-1 shadow-sm" aria-label="Kiểu hiển thị lớp học">
          <button
            className={cn(
              'inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-black transition',
              viewMode === 'table' ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-600 hover:bg-orange-50 hover:text-orange-700',
            )}
            type="button"
            onClick={() => setViewMode('table')}
            aria-pressed={viewMode === 'table'}
            title="Hiển thị dạng bảng"
          >
            <Table size={17} />
            Table
          </button>
          <button
            className={cn(
              'inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-black transition',
              viewMode === 'card' ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-600 hover:bg-orange-50 hover:text-orange-700',
            )}
            type="button"
            onClick={() => setViewMode('card')}
            aria-pressed={viewMode === 'card'}
            title="Hiển thị dạng card"
          >
            <LayoutGrid size={17} />
            Card
          </button>
        </div>
      </div>
      {viewMode === 'table'
        ? <ClassesTable classes={classes} onView={setSelectedClass} />
        : <ClassCards classes={classes} onView={setSelectedClass} />}
      {selectedClass && (
        <ClassDetailModal
          classItem={selectedClass}
          students={selectedClassStudents}
          onClose={() => setSelectedClass(null)}
        />
      )}
    </div>
  )
}
