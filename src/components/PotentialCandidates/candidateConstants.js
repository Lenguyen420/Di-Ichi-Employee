export const candidateStatusTone = {
  Mới: 'orange',
  'Đang tư vấn': 'amber',
  'Đã hẹn test': 'green',
  'Cần gọi lại': 'rose',
}

export const candidateGenderOptions = ['Nam', 'Nữ', 'Khác']

export const candidateStatusOptions = ['Tất cả', ...Object.keys(candidateStatusTone)]

export const emptyCandidateAppointmentForm = {
  appointmentDateTime: '',
  appointmentType: 'Test đầu vào',
  appointmentRoom: 'Online',
  appointmentStatus: 'Mới tạo',
}

export const emptyCandidateForm = {
  id: '',
  name: '',
  gender: 'Nam',
  school: '',
  className: '',
  certificates: '',
  parentInfo: '',
  parentPhone: '',
  address: '',
  desiredCourses: '',
  freeSchedule: '',
  callCount: 0,
  status: 'Mới',
  ...emptyCandidateAppointmentForm,
}
