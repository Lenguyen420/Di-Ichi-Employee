import { useMemo, useState } from 'react'
import { LayoutGrid, Table } from 'lucide-react'
import { toast } from 'sonner'
import { CourseCards } from '../../components/Courses/CourseCards.jsx'
import { CourseDetailModal } from '../../components/Courses/CourseDetailModal.jsx'
import { CoursesTable } from '../../components/Courses/CoursesTable.jsx'
import { classes, courses } from '../../datas/employeePortalData.js'
import { cn } from '../../utils/cn.js'

const updateClassSize = (students) => {
  const [current = 0, capacity = 0] = String(students || '0/0').split('/').map((value) => Number(value) || 0)
  return `${Math.min(current + 1, capacity)}/${capacity}`
}

export const CoursesPage = () => {
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [courseClasses, setCourseClasses] = useState(classes)
  const [viewMode, setViewMode] = useState('table')
  const selectedClasses = useMemo(
    () => courseClasses.filter((classItem) => classItem.courseCode === selectedCourse?.code),
    [courseClasses, selectedCourse],
  )

  const handleAddStudent = (classItem, student) => {
    if (!student.name.trim() || !student.phone.trim()) {
      toast.error('Vui lòng nhập tên học viên và SĐT.')
      return
    }

    setCourseClasses((current) => current.map((item) => (item.id === classItem.id ? { ...item, students: updateClassSize(item.students) } : item)))
    toast.success(`Đã thêm ${student.name.trim()} vào lớp ${classItem.name}.`)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-bold text-orange-600">Khóa học</p>
          <h1 className="mt-1 text-2xl font-black text-slate-950 md:text-3xl">Danh sách khóa học</h1>
          <p className="mt-2 text-sm text-slate-500">Chi tiết khóa học, danh sách lớp và thông tin học phí.</p>
        </div>
        <div className="inline-flex h-11 w-fit overflow-hidden rounded-lg border border-orange-100 bg-white p-1 shadow-sm" aria-label="Kiểu hiển thị khóa học">
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
        ? <CoursesTable courses={courses} onView={setSelectedCourse} />
        : <CourseCards courses={courses} onView={setSelectedCourse} />}
      {selectedCourse && (
        <CourseDetailModal
          classes={selectedClasses}
          course={selectedCourse}
          onAddStudent={handleAddStudent}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </div>
  )
}
