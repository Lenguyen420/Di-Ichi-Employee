import { Clock, X } from 'lucide-react'
import { Button } from '../Common/Button.jsx'
import { appointmentStatuses, appointmentTypes } from '../../contexts/appointmentConstants.js'

export const AppointmentFormModal = ({ form, mode, onChange, onClose, onSubmit }) => (
  <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/20 p-4">
    <button className="absolute inset-0 cursor-default" type="button" onClick={onClose} aria-label="Đóng popup tạo lịch hẹn" />
    <section className="relative z-10 w-full max-w-3xl overflow-hidden rounded-lg border border-orange-100 bg-white shadow-2xl shadow-slate-950/20">
      <div className="flex items-start justify-between gap-4 border-b border-orange-100 px-5 py-4">
        <div>
          <p className="text-sm font-bold text-orange-600">Lịch hẹn</p>
          <h2 className="mt-1 text-xl font-black text-slate-950">{mode === 'edit' ? 'Sửa lịch hẹn' : 'Tạo lịch hẹn'}</h2>
        </div>
        <Button className="shrink-0" variant="ghost" type="button" onClick={onClose} aria-label="Đóng form">
          <X size={18} />
        </Button>
      </div>
      <form className="grid gap-4 p-5 md:grid-cols-2" onSubmit={onSubmit}>
        <FormField label="Tên khách hàng" required>
          <input placeholder="Tên khách hàng" value={form.customer} onChange={(event) => onChange('customer', event.target.value)} />
        </FormField>
        <FormField label="SĐT">
          <input placeholder="0901 234 567" value={form.phone} onChange={(event) => onChange('phone', event.target.value)} />
        </FormField>
        <FormField label="Loại lịch hẹn">
          <select value={form.type} onChange={(event) => onChange('type', event.target.value)}>
            {appointmentTypes.map((type) => <option key={type}>{type}</option>)}
          </select>
        </FormField>
        <FormField label="Ngày giờ hẹn" required>
          <input type="datetime-local" value={form.dateTime} onChange={(event) => onChange('dateTime', event.target.value)} />
        </FormField>
        <FormField label="Phòng/Kênh">
          <input placeholder="Online, Room 1" value={form.room} onChange={(event) => onChange('room', event.target.value)} />
        </FormField>
        <FormField label="Trạng thái lịch hẹn">
          <select value={form.status} onChange={(event) => onChange('status', event.target.value)}>
            {appointmentStatuses.map((status) => <option key={status}>{status}</option>)}
          </select>
        </FormField>
        <div className="flex justify-end gap-2 border-t border-orange-100 pt-4 md:col-span-2">
          <Button variant="ghost" type="button" onClick={onClose}>Hủy</Button>
          <Button type="submit"><Clock size={18} /> {mode === 'edit' ? 'Cập nhật lịch hẹn' : 'Lưu lịch hẹn'}</Button>
        </div>
      </form>
    </section>
  </div>
)

const FormField = ({ label, required = false, children }) => (
  <label className="block">
    <span className="text-sm font-black text-slate-700">
      {label}
      {required && <span className="text-rose-500"> *</span>}
    </span>
    <div className="mt-2 [&_input]:h-11 [&_input]:w-full [&_input]:rounded-lg [&_input]:border [&_input]:border-orange-100 [&_input]:px-3 [&_input]:text-sm [&_input]:outline-none [&_input]:transition [&_input]:focus:border-orange-300 [&_input]:focus:ring-4 [&_input]:focus:ring-orange-100 [&_select]:h-11 [&_select]:w-full [&_select]:rounded-lg [&_select]:border [&_select]:border-orange-100 [&_select]:px-3 [&_select]:text-sm [&_select]:outline-none [&_select]:focus:border-orange-300 [&_select]:focus:ring-4 [&_select]:focus:ring-orange-100">
      {children}
    </div>
  </label>
)
