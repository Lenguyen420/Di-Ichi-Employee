import { Clock, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '../Common/Button.jsx'
import { appointmentStatuses, appointmentTypes } from '../../datas/appStaticData.js'

export const AppointmentFormModal = ({ candidates = [], form, isSubmitting = false, mode, selectedCandidate, selectedCandidateId, onChange, onClose, onSubmit }) => {
  const { t } = useTranslation()

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/20 p-4">
      <button className="absolute inset-0 cursor-default" type="button" onClick={onClose} aria-label={t('Đóng popup tạo lịch hẹn')} />
      <section className="relative z-10 w-full max-w-3xl overflow-hidden rounded-lg border border-orange-100 bg-white shadow-2xl shadow-slate-950/20">
        <div className="flex items-start justify-between gap-4 border-b border-orange-100 px-5 py-4">
          <div>
            <p className="text-sm font-bold text-orange-600">{t('Lịch hẹn')}</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">{mode === 'edit' ? t('Sửa lịch hẹn') : t('Tạo lịch hẹn')}</h2>
          </div>
          <Button className="shrink-0" variant="ghost" type="button" onClick={onClose} aria-label={t('Đóng form')}>
            <X size={18} />
          </Button>
        </div>
        <form className="grid gap-4 p-5 md:grid-cols-2" onSubmit={onSubmit}>
          <FormField label={t('Tên ứng viên')} required>
            <select value={selectedCandidateId} onChange={(event) => onChange('candidateSelect', event.target.value)}>
              <option value="">{t('Chọn ứng viên tiềm năng')}</option>
              {candidates.map((candidate) => (
                <option key={candidate.id} value={candidate.id}>{candidate.name}</option>
              ))}
            </select>
            <input
              className="mt-3"
              placeholder={t('Hoặc nhập tên ứng viên mới')}
              value={form.customer}
              onChange={(event) => onChange('customer', event.target.value)}
            />
            <p className="mt-2 text-xs font-semibold text-slate-500">
              {selectedCandidate
                ? `${selectedCandidate.parentPhone || t('Chưa cập nhật SĐT phụ huynh')} · ${selectedCandidate.status ? t(selectedCandidate.status) : t('Chưa cập nhật trạng thái')}`
                : t('Ứng viên mới: {{name}}', { name: form.customer.trim() || t('chưa nhập tên') })}
            </p>
          </FormField>
          <FormField label={t('SĐT phụ huynh')}>
            <input placeholder="0901 234 567" value={form.phone} onChange={(event) => onChange('phone', event.target.value)} />
          </FormField>
          <FormField label={t('Loại lịch hẹn')}>
            <select value={form.type} onChange={(event) => onChange('type', event.target.value)}>
              {appointmentTypes.map((type) => <option key={type} value={type}>{t(type)}</option>)}
            </select>
          </FormField>
          <FormField label={t('Ngày giờ hẹn')} required>
            <input type="datetime-local" value={form.dateTime} onChange={(event) => onChange('dateTime', event.target.value)} />
          </FormField>
          <FormField label={t('Phòng/Kênh')}>
            <input placeholder="Online, Room 1" value={form.room} onChange={(event) => onChange('room', event.target.value)} />
          </FormField>
          <FormField label={t('Trạng thái lịch hẹn')}>
            <select value={form.status} onChange={(event) => onChange('status', event.target.value)}>
              {appointmentStatuses.map((status) => <option key={status} value={status}>{t(status)}</option>)}
            </select>
          </FormField>
          <div className="flex justify-end gap-2 border-t border-orange-100 pt-4 md:col-span-2">
            <Button disabled={isSubmitting} variant="ghost" type="button" onClick={onClose}>{t('Hủy')}</Button>
            <Button disabled={isSubmitting} type="submit"><Clock size={18} /> {isSubmitting ? t('Đang lưu...') : mode === 'edit' ? t('Cập nhật lịch hẹn') : t('Lưu lịch hẹn')}</Button>
          </div>
        </form>
      </section>
    </div>
  )
}

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
