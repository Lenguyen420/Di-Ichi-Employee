import { Save, X } from 'lucide-react'
import { Button } from '../Common/Button.jsx'
import { appointmentStatuses, appointmentTypes } from '../../datas/appStaticData.js'
import {
  candidateGenderOptions,
  candidateStatusTone,
  emptyCandidateForm,
  englishExperienceOptions,
  learningGoalOptions,
  learningStyleOptions,
} from '../../datas/potentialCandidatesData.js'

export const PotentialCandidateForm = ({ form, isSubmitting = false, mode = 'create', onChange, onClose, onReset, onSubmit }) => {
  const handleCheckboxChange = (field, option, checked) => {
    const currentValues = Array.isArray(form[field]) ? form[field] : []
    onChange(field, checked ? [...currentValues, option] : currentValues.filter((value) => value !== option))
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/20 p-4">
      <button className="absolute inset-0 cursor-default" type="button" onClick={onClose} aria-label="Đóng popup thêm ứng viên" />
      <section className="relative z-10 flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-lg border border-orange-100 bg-white shadow-2xl shadow-slate-950/20">
        <div className="flex items-start justify-between gap-4 border-b border-orange-100 px-5 py-4">
          <div className="min-w-0">
            <h2 className="text-xl font-black text-slate-950">{mode === 'edit' ? 'Chỉnh sửa ứng viên' : 'Thêm mới ứng viên'}</h2>
            <p className="mt-1 text-sm text-slate-500">Nhập đầy đủ thông tin học viên, phụ huynh, nhu cầu học tập và đăng ký.</p>
          </div>
          <Button className="shrink-0" variant="ghost" type="button" onClick={onClose} aria-label="Đóng form">
            <X size={18} />
          </Button>
        </div>

        <form className="flex min-h-0 flex-1 flex-col" onSubmit={onSubmit}>
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5">
            <FormSection title="I. Thông tin học viên">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <FormField label="Họ và tên" required className="xl:col-span-2">
                  <input value={form.name} onChange={(event) => onChange('name', event.target.value)} placeholder="Nguyễn Minh Anh" />
                </FormField>
                <FormField label="Giới tính">
                  <select value={form.gender} onChange={(event) => onChange('gender', event.target.value)}>
                    {candidateGenderOptions.map((gender) => <option key={gender}>{gender}</option>)}
                  </select>
                </FormField>
                <FormField label="Năm sinh">
                  <input value={form.birthYear || ''} onChange={(event) => onChange('birthYear', event.target.value)} placeholder="2012" inputMode="numeric" />
                </FormField>
                <FormField label="Trường" className="xl:col-span-2">
                  <input value={form.school} onChange={(event) => onChange('school', event.target.value)} placeholder="THPT Nguyễn Thị Minh Khai" />
                </FormField>
                <FormField label="Lớp">
                  <input value={form.className} onChange={(event) => onChange('className', event.target.value)} placeholder="10A3" />
                </FormField>
                <FormField label="Địa chỉ" className="xl:col-span-4">
                  <input value={form.address} onChange={(event) => onChange('address', event.target.value)} placeholder="24 Nguyễn Văn Trỗi, Phú Nhuận, TP.HCM" />
                </FormField>
              </div>
            </FormSection>

            <FormSection title="II. Thông tin phụ huynh">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <FormField label="Họ tên Cha">
                  <input value={form.fatherName || ''} onChange={(event) => onChange('fatherName', event.target.value)} placeholder="Nguyễn Văn A" />
                </FormField>
                <FormField label="SĐT Cha">
                  <input value={form.fatherPhone || ''} onChange={(event) => onChange('fatherPhone', event.target.value)} placeholder="0901 234 567" type="tel" />
                </FormField>
                <FormField label="Họ tên Mẹ">
                  <input value={form.motherName || ''} onChange={(event) => onChange('motherName', event.target.value)} placeholder="Trần Thu Hà" />
                </FormField>
                <FormField label="SĐT Mẹ">
                  <input value={form.motherPhone || ''} onChange={(event) => onChange('motherPhone', event.target.value)} placeholder="0901 234 568" type="tel" />
                </FormField>
                <FormField label="Thông tin phụ huynh khác" className="xl:col-span-2">
                  <input value={form.parentInfo || ''} onChange={(event) => onChange('parentInfo', event.target.value)} placeholder="Người liên hệ chính, ghi chú thêm" />
                </FormField>
                <FormField label="SĐT phụ huynh khác" className="xl:col-span-2">
                  <input value={form.parentPhone || ''} onChange={(event) => onChange('parentPhone', event.target.value)} placeholder="Số liên hệ khác nếu có" type="tel" />
                </FormField>
              </div>
            </FormSection>

            <FormSection title="III. Nhu cầu học tập">
              <div className="space-y-5">
                <CheckboxGroup
                  label="1. Mục tiêu của phụ huynh"
                  options={learningGoalOptions}
                  value={form.learningGoals}
                  onChange={(option, checked) => handleCheckboxChange('learningGoals', option, checked)}
                />
                <FormField label="Khác">
                  <input value={form.otherLearningGoal || ''} onChange={(event) => onChange('otherLearningGoal', event.target.value)} placeholder="Nhu cầu khác của phụ huynh" />
                </FormField>

                <div className="space-y-3">
                  <CheckboxGroup
                    label="2. Quá trình học tiếng Anh trước đây"
                    helper="Con đã học tiếng Anh bao lâu?"
                    options={englishExperienceOptions}
                    value={form.englishExperience}
                    onChange={(option, checked) => handleCheckboxChange('englishExperience', option, checked)}
                  />
                  <FormField label="Con từng học ở trung tâm nào chưa?">
                    <input value={form.previousEnglishCenter || ''} onChange={(event) => onChange('previousEnglishCenter', event.target.value)} placeholder="Tên trung tâm hoặc ghi chú" />
                  </FormField>
                </div>

                <CheckboxGroup
                  label="3. Con thích học theo hình thức"
                  options={learningStyleOptions}
                  value={form.learningStyles}
                  onChange={(option, checked) => handleCheckboxChange('learningStyles', option, checked)}
                />
              </div>
            </FormSection>

            <FormSection title="IV. Thông tin đăng ký">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                <FormField label="Khóa học">
                  <input value={form.registrationCourse || ''} onChange={(event) => onChange('registrationCourse', event.target.value)} placeholder="IELTS Foundation" />
                </FormField>
                <FormField label="Ca học">
                  <input value={form.registrationShift || ''} onChange={(event) => onChange('registrationShift', event.target.value)} placeholder="18:00-19:30" />
                </FormField>
                <FormField label="Ngày học">
                  <input value={form.registrationDays || ''} onChange={(event) => onChange('registrationDays', event.target.value)} placeholder="T2/T4/T6" />
                </FormField>
                <FormField label="Học phí">
                  <input value={form.registrationTuition || ''} onChange={(event) => onChange('registrationTuition', event.target.value)} placeholder="12.800.000" />
                </FormField>
                <FormField label="Ghi chú">
                  <input value={form.registrationNote || ''} onChange={(event) => onChange('registrationNote', event.target.value)} placeholder="Ưu đãi, cọc, lưu ý" />
                </FormField>
              </div>
            </FormSection>

            <FormSection title="Thông tin tư vấn nội bộ">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <FormField label="Các chứng chỉ đang có">
                  <input value={form.certificates} onChange={(event) => onChange('certificates', event.target.value)} placeholder="Flyers, KET 135, IELTS 4.5" />
                </FormField>
                <FormField label="Các khóa học mong muốn">
                  <input value={form.desiredCourses} onChange={(event) => onChange('desiredCourses', event.target.value)} placeholder="IELTS Foundation, Giao tiếp" />
                </FormField>
                <FormField label="Trạng thái">
                  <select value={form.status} onChange={(event) => onChange('status', event.target.value)}>
                    {Object.keys(candidateStatusTone).map((status) => <option key={status}>{status}</option>)}
                  </select>
                </FormField>
                {mode === 'edit' && (
                  <FormField label="Số lần gọi">
                    <input min="0" type="number" value={form.callCount ?? 0} onChange={(event) => onChange('callCount', event.target.value)} />
                  </FormField>
                )}
                <FormField label="Lịch rảnh" className="xl:col-span-3">
                  <textarea value={form.freeSchedule} onChange={(event) => onChange('freeSchedule', event.target.value)} placeholder="T2/T4 sau 18:00, CN sáng" />
                </FormField>
              </div>
            </FormSection>

            <FormSection title="Tạo lịch hẹn">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <FormField label="Ngày giờ hẹn">
                  <input type="datetime-local" value={form.appointmentDateTime || ''} onChange={(event) => onChange('appointmentDateTime', event.target.value)} />
                </FormField>
                <FormField label="Loại lịch hẹn">
                  <select value={form.appointmentType || appointmentTypes[0]} onChange={(event) => onChange('appointmentType', event.target.value)}>
                    {appointmentTypes.map((type) => <option key={type}>{type}</option>)}
                  </select>
                </FormField>
                <FormField label="Phòng/Kênh">
                  <input value={form.appointmentRoom || ''} onChange={(event) => onChange('appointmentRoom', event.target.value)} placeholder="Online, Room 1" />
                </FormField>
                <FormField label="Trạng thái lịch hẹn">
                  <select value={form.appointmentStatus || appointmentStatuses[0]} onChange={(event) => onChange('appointmentStatus', event.target.value)}>
                    {appointmentStatuses.map((status) => <option key={status}>{status}</option>)}
                  </select>
                </FormField>
              </div>
            </FormSection>
          </div>

          <div className="flex flex-wrap justify-end gap-2 border-t border-orange-100 bg-orange-50/50 px-5 py-4">
            <Button disabled={isSubmitting} variant="ghost" type="button" onClick={onClose}>Hủy</Button>
            <Button disabled={isSubmitting} variant="secondary" type="button" onClick={() => onReset(emptyCandidateForm)}>Làm mới</Button>
            <Button disabled={isSubmitting} type="submit"><Save size={18} /> {isSubmitting ? 'Đang lưu...' : mode === 'edit' ? 'Cập nhật ứng viên' : 'Lưu ứng viên'}</Button>
          </div>
        </form>
      </section>
    </div>
  )
}

const FormSection = ({ title, children }) => (
  <section className="space-y-4">
    <div className="border-l-4 border-orange-600 bg-slate-100 px-4 py-3">
      <h3 className="text-sm font-black uppercase text-slate-950">{title}</h3>
    </div>
    {children}
  </section>
)

const CheckboxGroup = ({ helper, label, onChange, options, value = [] }) => {
  const selectedValues = Array.isArray(value) ? value : []

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-black text-slate-800">{label}</legend>
      {helper && <p className="text-sm font-semibold text-slate-600">{helper}</p>}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((option) => (
          <label key={option} className="flex min-h-10 items-center gap-2 rounded-lg border border-orange-100 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50/50">
            <input
              checked={selectedValues.includes(option)}
              className="h-4 w-4 rounded border-orange-200 text-orange-600 focus:ring-orange-200"
              type="checkbox"
              onChange={(event) => onChange(option, event.target.checked)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

const FormField = ({ label, required = false, className = '', children }) => (
  <label className={`block ${className}`}>
    <span className="text-sm font-black text-slate-700">
      {label}
      {required && <span className="text-rose-500"> *</span>}
    </span>
    <div className="mt-2 [&_input]:h-11 [&_input]:w-full [&_input]:rounded-lg [&_input]:border [&_input]:border-orange-100 [&_input]:px-3 [&_input]:text-sm [&_input]:outline-none [&_input]:transition [&_input]:focus:border-orange-300 [&_input]:focus:ring-4 [&_input]:focus:ring-orange-100 [&_select]:h-11 [&_select]:w-full [&_select]:rounded-lg [&_select]:border [&_select]:border-orange-100 [&_select]:px-3 [&_select]:text-sm [&_select]:outline-none [&_select]:focus:border-orange-300 [&_select]:focus:ring-4 [&_select]:focus:ring-orange-100 [&_textarea]:min-h-24 [&_textarea]:w-full [&_textarea]:rounded-lg [&_textarea]:border [&_textarea]:border-orange-100 [&_textarea]:px-3 [&_textarea]:py-2 [&_textarea]:text-sm [&_textarea]:outline-none [&_textarea]:focus:border-orange-300 [&_textarea]:focus:ring-4 [&_textarea]:focus:ring-orange-100">
      {children}
    </div>
  </label>
)
