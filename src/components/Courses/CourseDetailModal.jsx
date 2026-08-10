import { useState } from 'react'
import { X } from 'lucide-react'
import { Badge } from '../Common/Badge.jsx'
import { Button } from '../Common/Button.jsx'

const parseClassSize = (students) => {
  const [current = 0, capacity = 0] = String(students || '0/0').split('/').map((value) => Number(value) || 0)
  return { current, capacity }
}

const emptyStudentForm = { name: '', phone: '', level: '' }

export const CourseDetailModal = ({ classes, course, onAddStudent, onClose }) => {
  const [studentForms, setStudentForms] = useState({})

  if (!course) return null

  const updateStudentForm = (classId, field, value) => {
    setStudentForms((current) => ({
      ...current,
      [classId]: {
        ...emptyStudentForm,
        ...current[classId],
        [field]: value,
      },
    }))
  }

  const handleAddStudent = (classItem) => {
    const student = { ...emptyStudentForm, ...studentForms[classItem.id] }
    onAddStudent(classItem, student)
    setStudentForms((current) => ({ ...current, [classItem.id]: emptyStudentForm }))
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/20 p-4">
      <button className="absolute inset-0 cursor-default" type="button" onClick={onClose} aria-label="Đóng popup chi tiết khóa học" />
      <section className="relative z-10 w-full max-w-7xl overflow-hidden rounded-lg border border-orange-100 bg-white shadow-2xl shadow-slate-950/20">
        <div className="flex items-start justify-between gap-4 border-b border-orange-100 px-5 py-4">
          <div>
            <p className="text-sm font-bold text-orange-600">Chi tiết khóa học</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">{course.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{course.code} - {course.level}</p>
          </div>
          <Button className="shrink-0" variant="ghost" type="button" onClick={onClose} aria-label="Đóng chi tiết">
            <X size={18} />
          </Button>
        </div>

        <div className="max-h-[72vh] overflow-y-auto p-5">
          <div className="grid gap-3 md:grid-cols-3">
            <Info label="Thời lượng" value={course.duration} />
            <Info label="Học phí" value={course.tuition} />
            <Info label="Số lớp" value={`${classes.length} lớp`} />
          </div>

          <div className="mt-5">
            <h3 className="text-lg font-black text-slate-950">Danh sách lớp của khóa học</h3>
            <div className="mt-3 overflow-hidden rounded-lg border border-orange-100">
              <table className="min-w-full divide-y divide-orange-100 text-left text-sm">
                <thead className="bg-orange-50 text-xs uppercase text-orange-700">
                  <tr>
                    <th className="px-4 py-3 font-black">Lớp học</th>
                    <th className="px-4 py-3 font-black">Giáo viên</th>
                    <th className="px-4 py-3 font-black">Lịch học</th>
                    <th className="px-4 py-3 font-black">Sĩ số</th>
                    <th className="px-4 py-3 font-black">Phòng</th>
                    <th className="px-4 py-3 font-black">Thêm học viên</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-50">
                  {classes.length ? classes.map((item) => {
                    const { capacity, current } = parseClassSize(item.students)
                    const hasSeat = current < capacity
                    const studentForm = { ...emptyStudentForm, ...studentForms[item.id] }

                    return (
                      <tr key={item.id} className="hover:bg-orange-50/60">
                        <td className="px-4 py-3 font-semibold text-slate-800">{item.name}</td>
                        <td className="px-4 py-3 text-slate-700">{item.teacher}</td>
                        <td className="px-4 py-3 text-slate-700">{item.schedule}</td>
                        <td className="px-4 py-3"><Badge tone={hasSeat ? 'orange' : 'green'}>{item.students}</Badge></td>
                        <td className="px-4 py-3 text-slate-700">{item.room}</td>
                        <td className="min-w-72 px-4 py-3">
                          {hasSeat ? (
                            <div className="grid min-w-[520px] gap-2 xl:grid-cols-[1fr_150px_120px_auto]">
                              <input className="h-10 rounded-lg border border-orange-100 px-3 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100" placeholder="Tên học viên" value={studentForm.name} onChange={(event) => updateStudentForm(item.id, 'name', event.target.value)} />
                              <input className="h-10 rounded-lg border border-orange-100 px-3 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100" placeholder="SĐT" value={studentForm.phone} onChange={(event) => updateStudentForm(item.id, 'phone', event.target.value)} />
                              <input className="h-10 rounded-lg border border-orange-100 px-3 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100" placeholder="Trình độ" value={studentForm.level} onChange={(event) => updateStudentForm(item.id, 'level', event.target.value)} />
                              <Button className="h-10 shrink-0" variant="secondary" type="button" onClick={() => handleAddStudent(item)}>Thêm</Button>
                            </div>
                          ) : (
                            <Badge tone="green">Đủ sĩ số</Badge>
                          )}
                        </td>
                      </tr>
                    )
                  }) : (
                    <tr>
                      <td className="px-4 py-5 text-center font-semibold text-slate-500" colSpan={6}>Chưa có lớp cho khóa học này</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

const Info = ({ label, value }) => (
  <div className="rounded-lg border border-orange-100 p-3">
    <p className="text-xs font-black uppercase text-slate-400">{label}</p>
    <p className="mt-1 font-semibold text-slate-800">{value}</p>
  </div>
)
