import { useMemo, useState } from 'react'
import { Filter, LayoutGrid, Search, Table } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Card } from '../../components/Common/Card.jsx'
import { CourseCards } from '../../components/Courses/CourseCards.jsx'
import { CourseDetailModal } from '../../components/Courses/CourseDetailModal.jsx'
import { CoursesTable } from '../../components/Courses/CoursesTable.jsx'
import { classes, courses } from '../../datas/employeePortalData.js'
import { cn } from '../../utils/cn.js'

const updateClassSize = (students) => {
  const [current = 0, capacity = 0] = String(students || '0/0').split('/').map((value) => Number(value) || 0)
  return `${Math.min(current + 1, capacity)}/${capacity}`
}

const allAgesOption = 'Tất cả độ tuổi'

export const CoursesPage = () => {
  const { t } = useTranslation()
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [courseClasses, setCourseClasses] = useState(classes)
  const [viewMode, setViewMode] = useState('table')
  const [courseNameKeyword, setCourseNameKeyword] = useState('')
  const [ageFilter, setAgeFilter] = useState(allAgesOption)
  const ageOptions = useMemo(() => [...new Set(courses.map((course) => course.age).filter(Boolean))], [])
  const filteredCourses = useMemo(
    () =>
      courses.filter((course) => {
        const matchesName = course.name.toLowerCase().includes(courseNameKeyword.trim().toLowerCase())
        const matchesAge = ageFilter === allAgesOption || course.age === ageFilter

        return matchesName && matchesAge
      }),
    [ageFilter, courseNameKeyword],
  )
  const selectedClasses = useMemo(
    () => courseClasses.filter((classItem) => classItem.courseCode === selectedCourse?.code),
    [courseClasses, selectedCourse],
  )

  const handleAddStudent = (classItem, student) => {
    if (!student.name.trim() || !student.phone.trim()) {
      toast.error(t('Vui lòng nhập tên học viên và SĐT.'))
      return
    }

    setCourseClasses((current) => current.map((item) => (item.id === classItem.id ? { ...item, students: updateClassSize(item.students) } : item)))
    toast.success(t('Đã thêm {{student}} vào lớp {{className}}.', { student: student.name.trim(), className: classItem.name }))
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-bold text-orange-600">{t('Khóa học')}</p>
          <h1 className="mt-1 text-2xl font-black text-slate-950 md:text-3xl">{t('Danh sách khóa học')}</h1>
          <p className="mt-2 text-sm text-slate-500">{t('Chi tiết khóa học, danh sách lớp và thông tin học phí.')}</p>
        </div>
        <div className="inline-flex h-11 w-fit overflow-hidden rounded-lg border border-orange-100 bg-white p-1 shadow-sm" aria-label={t('Kiểu hiển thị khóa học')}>
          <button
            className={cn(
              'inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-black transition',
              viewMode === 'table' ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-600 hover:bg-orange-50 hover:text-orange-700',
            )}
            type="button"
            onClick={() => setViewMode('table')}
            aria-pressed={viewMode === 'table'}
            title={t('Hiển thị dạng bảng')}
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
            title={t('Hiển thị dạng card')}
          >
            <LayoutGrid size={17} />
            Card
          </button>
        </div>
      </div>

      <Card className="rounded-lg">
        <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
          <label className="block">
            <span className="text-sm font-black text-slate-700">{t('Tìm kiếm tên khóa học')}</span>
            <div className="relative mt-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                className="h-11 w-full rounded-lg border border-orange-100 px-10 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                placeholder={t('Nhập tên khóa học cần tìm')}
                value={courseNameKeyword}
                onChange={(event) => setCourseNameKeyword(event.target.value)}
              />
            </div>
          </label>
          <label className="block">
            <span className="text-sm font-black text-slate-700">{t('Độ tuổi')}</span>
            <div className="relative mt-2">
              <Filter className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select
                className="h-11 w-full rounded-lg border border-orange-100 px-10 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                value={ageFilter}
                onChange={(event) => setAgeFilter(event.target.value)}
              >
                <option value={allAgesOption}>{t(allAgesOption)}</option>
                {ageOptions.map((age) => <option key={age} value={age}>{age}</option>)}
              </select>
            </div>
          </label>
        </div>
      </Card>

      {viewMode === 'table'
        ? <CoursesTable courses={filteredCourses} onView={setSelectedCourse} />
        : <CourseCards courses={filteredCourses} onView={setSelectedCourse} />}
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
