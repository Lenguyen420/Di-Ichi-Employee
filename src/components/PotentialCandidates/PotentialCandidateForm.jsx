import { Save, X } from 'lucide-react'
import { Button } from '../Common/Button.jsx'
import { appointmentStatuses, appointmentTypes } from '../../contexts/appointmentConstants.js'
import { candidateGenderOptions, candidateStatusTone, emptyCandidateForm } from './candidateConstants.js'

export const PotentialCandidateForm = ({ form, mode = 'create', onChange, onClose, onReset, onSubmit }) => (
  <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/20 p-4">
    <button className="absolute inset-0 cursor-default" type="button" onClick={onClose} aria-label="Đóng popup thêm ứng viên" />
    <section className="relative z-10 flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg border border-orange-100 bg-white shadow-2xl shadow-slate-950/20">
      <div className="flex items-start justify-between gap-4 border-b border-orange-100 px-5 py-4">
        <div className="min-w-0">
          <h2 className="text-xl font-black text-slate-950">{mode === 'edit' ? 'Chỉnh sửa ứng viên' : 'Thêm mới ứng viên'}</h2>
          <p className="mt-1 text-sm text-slate-500">Nhập thông tin học viên tiềm năng, phụ huynh, chứng chỉ và lịch rảnh.</p>
        </div>
        <Button className="shrink-0" variant="ghost" type="button" onClick={onClose} aria-label="Đóng form">
          <X size={18} />
        </Button>
      </div>

      <form className="flex min-h-0 flex-1 flex-col" onSubmit={onSubmit}>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <FormField label="Tên ứng viên" required>
              <input value={form.name} onChange={(event) => onChange('name', event.target.value)} placeholder="Nguyễn Minh Anh" />
            </FormField>
            <FormField label="Giới tính học viên">
              <select value={form.gender} onChange={(event) => onChange('gender', event.target.value)}>
                {candidateGenderOptions.map((gender) => <option key={gender}>{gender}</option>)}
              </select>
            </FormField>
            <FormField label="Trường">
              <input value={form.school} onChange={(event) => onChange('school', event.target.value)} placeholder="THPT Nguyễn Thị Minh Khai" />
            </FormField>
            <FormField label="Lớp">
              <input value={form.className} onChange={(event) => onChange('className', event.target.value)} placeholder="10A3" />
            </FormField>
            <FormField label="Các chứng chỉ đang có">
              <input value={form.certificates} onChange={(event) => onChange('certificates', event.target.value)} placeholder="Flyers, KET 135, IELTS 4.5" />
            </FormField>
            <FormField label="Tên phụ huynh" required>
              <input value={form.parentInfo} onChange={(event) => onChange('parentInfo', event.target.value)} placeholder="Mẹ: Trần Thu Hà" />
            </FormField>
            <FormField label="SĐT phụ huynh" required>
              <input value={form.parentPhone} onChange={(event) => onChange('parentPhone', event.target.value)} placeholder="0901 234 567" type="tel" />
            </FormField>
            <FormField label="Các khóa học mong muốn">
              <input value={form.desiredCourses} onChange={(event) => onChange('desiredCourses', event.target.value)} placeholder="IELTS Foundation, Giao tiếp" />
            </FormField>
            <FormField label="Địa chỉ nhà ở" className="xl:col-span-2">
              <input value={form.address} onChange={(event) => onChange('address', event.target.value)} placeholder="24 Nguyễn Văn Trỗi, Phú Nhuận, TP.HCM" />
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
            {mode === 'edit' && (
              <div className="space-y-4 rounded-lg border border-orange-100 bg-orange-50/40 p-4 xl:col-span-3">
                <h3 className="text-sm font-black uppercase text-orange-700">Tạo lịch hẹn</h3>
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
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t border-orange-100 bg-orange-50/50 px-5 py-4">
          <Button variant="ghost" type="button" onClick={onClose}>Hủy</Button>
          <Button variant="secondary" type="button" onClick={() => onReset(emptyCandidateForm)}>Làm mới</Button>
          <Button type="submit"><Save size={18} /> {mode === 'edit' ? 'Cập nhật ứng viên' : 'Lưu ứng viên'}</Button>
        </div>
      </form>
    </section>
  </div>
)

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
