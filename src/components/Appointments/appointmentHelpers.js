export const allAppointmentsOption = 'Tất cả'

export const appointmentStatusTone = {
  'Mới tạo': 'orange',
  'Chờ xác nhận': 'amber',
  'Đã xác nhận': 'green',
  'Đã hoàn thành': 'green',
  'Đã hủy': 'rose',
}

export const emptyAppointmentForm = {
  customer: '',
  phone: '',
  customerId: '',
  candidateId: '',
  type: 'Test đầu vào',
  dateTime: '',
  room: 'Online',
  status: 'Mới tạo',
}

export const splitDateTime = (dateTime) => {
  const [date = '', time = ''] = String(dateTime || '').split('T')
  return { date, time }
}

export const toDateTimeValue = (appointment) => {
  if (!appointment?.date) return ''
  return `${appointment.date}T${appointment.time || '00:00'}`
}
