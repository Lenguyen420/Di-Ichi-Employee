export const candidateStatusTone = {
  potential: 'orange',
  trial: 'amber',
  active: 'green',
  reserved: 'amber',
  stopped: 'rose',
}

export const candidateStatusLabels = {
  potential: 'Tiềm năng',
  trial: 'Học thử',
  active: 'Đang học',
  reserved: 'Bảo lưu',
  stopped: 'Nghỉ học',
}

export const candidateGenderOptions = ['Nam', 'Nữ', 'Khác']

export const candidateStatusOptions = ['Tất cả', ...Object.keys(candidateStatusTone)]

export const learningGoalOptions = [
  'Học giao tiếp',
  'Học theo chương trình Bộ GD',
  'Chuẩn bị vào lớp 6,10',
  'Chuẩn bị thi chứng chỉ',
  'Mất gốc',
  'Muốn con tự tin hơn',
]

export const englishExperienceOptions = ['Chưa từng học', 'Dưới 1 năm', '1-3 năm', 'Trên 3 năm']

export const learningStyleOptions = ['Học qua trò chơi', 'Thuyết trình', 'Dự án', 'Online', 'Offline']

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
  birthYear: '',
  school: '',
  className: '',
  certificates: '',
  fatherName: '',
  fatherPhone: '',
  motherName: '',
  motherPhone: '',
  parentInfo: '',
  parentPhone: '',
  address: '',
  learningGoals: [],
  otherLearningGoal: '',
  englishExperience: [],
  previousEnglishCenter: '',
  learningStyles: [],
  registrationCourse: '',
  registrationShift: '',
  registrationDays: '',
  registrationTuition: '',
  registrationNote: '',
  desiredCourses: '',
  freeSchedule: '',
  callCount: 0,
  status: 'potential',
  ...emptyCandidateAppointmentForm,
}

export const potentialCandidates = [
  {
    id: 'UV-1001',
    customerId: 'KH-1024',
    name: 'Nguyễn Minh Anh',
    gender: 'Nữ',
    school: 'THPT Nguyễn Thị Minh Khai',
    className: '10A3',
    certificates: ['Flyers', 'KET 135'],
    parentInfo: 'Mẹ: Trần Thu Hà',
    parentPhone: '0901 234 567',
    address: '24 Nguyễn Văn Trỗi, Phú Nhuận, TP.HCM',
    desiredCourses: ['IELTS Foundation', 'Giao tiếp thiếu niên'],
    freeSchedule: 'T2/T4 sau 18:00, CN sáng',
    callCount: 2,
    status: 'Mới',
  },
  {
    id: 'UV-1002',
    customerId: 'KH-1025',
    name: 'Trần Quốc Bảo',
    gender: 'Nam',
    school: 'THCS Lê Quý Đôn',
    className: '8B1',
    certificates: ['Cambridge PET'],
    parentInfo: 'Ba: Trần Minh Quân',
    parentPhone: '0918 456 123',
    address: '118 Võ Văn Tần, Quận 3, TP.HCM',
    desiredCourses: ['IELTS Junior', 'Grammar Booster'],
    freeSchedule: 'T3/T5 19:00, T7 chiều',
    callCount: 3,
    status: 'Đang tư vấn',
  },
  {
    id: 'UV-1003',
    customerId: 'KH-1026',
    name: 'Lê Khánh Vy',
    gender: 'Nữ',
    school: 'THPT Gia Định',
    className: '11C2',
    certificates: ['IELTS 4.5'],
    parentInfo: 'Mẹ: Lê Ngọc Mai',
    parentPhone: '0932 777 888',
    address: '52 Bạch Đằng, Bình Thạnh, TP.HCM',
    desiredCourses: ['IELTS Intermediate'],
    freeSchedule: 'T2/T6 18:30',
    callCount: 1,
    status: 'Đã hẹn test',
  },
  {
    id: 'UV-1004',
    customerId: 'KH-1027',
    name: 'Phạm Đức Huy',
    gender: 'Nam',
    school: 'THCS Trần Văn Ơn',
    className: '7A5',
    certificates: ['Starters'],
    parentInfo: 'Ba: Phạm Anh Tuấn',
    parentPhone: '0988 222 456',
    address: '9 Phan Xích Long, Phú Nhuận, TP.HCM',
    desiredCourses: ['Kids Starter', 'Phonics'],
    freeSchedule: 'T7/CN buổi sáng',
    callCount: 4,
    status: 'Cần gọi lại',
  },
]
