export const customers = [
  { id: 'KH-1024', candidateId: 'UV-1001', name: 'Nguyễn Minh Anh', phone: '0901 234 567', source: 'Facebook Ads', status: 'Mới', level: 'A2', owner: 'Lan Anh', nextAction: 'Gọi tư vấn', expectedValue: '12.8M', calledCount: 2 },
  { id: 'KH-1025', candidateId: 'UV-1002', name: 'Trần Quốc Bảo', phone: '0918 456 123', source: 'Referral', status: 'Đang tư vấn', level: 'B1', owner: 'Minh Châu', nextAction: 'Test đầu vào', expectedValue: '18.5M', calledCount: 3 },
  { id: 'KH-1026', candidateId: 'UV-1003', name: 'Lê Khánh Vy', phone: '0932 777 888', source: 'Website', status: 'Đã đăng ký', level: 'IELTS 4.5', owner: 'Lan Anh', nextAction: 'Đóng học phí', expectedValue: '24.0M', calledCount: 1 },
  { id: 'KH-1027', candidateId: 'UV-1004', name: 'Phạm Đức Huy', phone: '0988 222 456', source: 'Walk-in', status: 'Chăm sóc lại', level: 'A1', owner: 'Hoàng Nam', nextAction: 'Gọi lại', expectedValue: '9.5M', calledCount: 4 },
]

export const availableStudents = [
  { id: 'STU-1001', candidateId: 'UV-1001', customerId: 'KH-1024', name: 'Nguyễn Minh Anh', phone: '0901 234 567', level: 'A2', recommendedCourseCode: 'IELTS-FD' },
  { id: 'STU-1002', candidateId: 'UV-1002', customerId: 'KH-1025', name: 'Trần Quốc Bảo', phone: '0918 456 123', level: 'B1', recommendedCourseCode: 'IELTS-INT' },
  { id: 'STU-1003', candidateId: 'UV-1004', customerId: 'KH-1027', name: 'Phạm Đức Huy', phone: '0988 222 456', level: 'A1', recommendedCourseCode: 'KIDS-START' },
  { id: 'STU-1004', candidateId: 'UV-1003', customerId: 'KH-1026', name: 'Lê Khánh Vy', phone: '0932 777 888', level: 'IELTS 4.5', recommendedCourseCode: 'IELTS-INT' },
]

export const classStudents = [
  { id: 'CS-1001', classId: 'CLASS-1001', studentId: 'STU-1001', status: 'Đang học' },
  { id: 'CS-1002', classId: 'CLASS-1002', studentId: 'STU-1002', status: 'Đang học' },
  { id: 'CS-1003', classId: 'CLASS-1003', studentId: 'STU-1003', status: 'Đang học' },
]

export const kpis = [
  { id: 'called-candidates', label: 'Ứng viên đã gọi', value: '86', change: '+14 hôm nay', tone: 'green', detail: 'Tổng số ứng viên đã được nhân viên gọi trong tháng này.' },
  { id: 'new-candidates', label: 'Ứng viên mới', value: '126', change: '+24', tone: 'orange', detail: 'Ứng viên mới từ Facebook Ads, Website, Referral và Walk-in.' },
  { id: 'today-appointments', label: 'Lịch hẹn hôm nay', value: '18', change: '6 test đầu vào', tone: 'amber', detail: 'Bao gồm tư vấn, test đầu vào, đóng học phí và ký hợp đồng.' },
  { id: 'pending-tasks', label: 'Công việc còn lại', value: '32', change: '9 quá hạn', tone: 'rose', detail: 'Các công việc chăm sóc, xác nhận lịch và gửi báo giá chưa hoàn tất.' },
]

export const calledCandidatesSeries = [
  { month: 'T2', value: 48 },
  { month: 'T3', value: 55 },
  { month: 'T4', value: 61 },
  { month: 'T5', value: 70 },
  { month: 'T6', value: 78 },
  { month: 'T7', value: 86 },
]

export const customerTimeline = [
  { id: 'TL-1001', customerId: 'KH-1024', content: 'Tạo khách hàng từ chiến dịch Facebook Ads' },
  { id: 'TL-1002', customerId: 'KH-1024', content: 'Gọi lần 1: phụ huynh quan tâm lớp IELTS Foundation' },
  { id: 'TL-1003', customerId: 'KH-1024', content: 'Đặt lịch test đầu vào vào 18:30 hôm nay' },
  { id: 'TL-1004', customerId: 'KH-1024', content: 'Gửi bảng học phí và lịch khai giảng qua Zalo' },
]

export const calls = [
  { id: 'CALL-1001', customerId: 'KH-1024', candidateId: 'UV-1001', customer: 'Nguyễn Minh Anh', phone: '0901 234 567', time: '09:00', status: 'Hôm nay', result: 'Chưa gọi', owner: 'Lan Anh' },
  { id: 'CALL-1002', customerId: 'KH-1027', candidateId: 'UV-1004', customer: 'Phạm Đức Huy', phone: '0988 222 456', time: '10:30', status: 'Quá hạn', result: 'Không nghe máy', owner: 'Hoàng Nam' },
  { id: 'CALL-1003', customerId: 'KH-1025', candidateId: 'UV-1002', customer: 'Trần Quốc Bảo', phone: '0918 456 123', time: '14:00', status: 'Hôm nay', result: 'Đồng ý test', owner: 'Minh Châu' },
  { id: 'CALL-1004', customerId: 'KH-1026', candidateId: 'UV-1003', customer: 'Lê Khánh Vy', phone: '0932 777 888', time: '16:15', status: 'Gọi lại', result: 'Cần phụ huynh xác nhận', owner: 'Lan Anh' },
]

export const appointments = [
  { id: 'LH-1001', customerId: 'KH-1024', candidateId: 'UV-1001', date: '2026-08-08', time: '09:30', customer: 'Nguyễn Minh Anh', phone: '0901 234 567', type: 'Test đầu vào', room: 'Room 3', status: 'Đã xác nhận' },
  { id: 'LH-1002', customerId: 'KH-1025', candidateId: 'UV-1002', date: '2026-08-08', time: '11:00', customer: 'Trần Quốc Bảo', phone: '0918 456 123', type: 'Tư vấn', room: 'Online', status: 'Chờ xác nhận' },
  { id: 'LH-1003', customerId: 'KH-1026', candidateId: 'UV-1003', date: '2026-08-08', time: '15:30', customer: 'Lê Khánh Vy', phone: '0932 777 888', type: 'Đóng học phí', room: 'Front Desk', status: 'Đã xác nhận' },
  { id: 'LH-1004', customerId: 'KH-1027', candidateId: 'UV-1004', date: '2026-08-09', time: '10:00', customer: 'Phạm Đức Huy', phone: '0988 222 456', type: 'Ký hợp đồng', room: 'Room 1', status: 'Mới tạo' },
]

export const courses = [
  { code: 'IELTS-FD', name: 'IELTS Foundation', level: 'A2-B1', duration: '36 buổi', tuition: '12.800.000đ', classIds: ['CLASS-1001', 'CLASS-1004', 'CLASS-1005'], classes: 3 },
  { code: 'IELTS-INT', name: 'IELTS Intermediate', level: 'B1-B2', duration: '42 buổi', tuition: '18.500.000đ', classIds: ['CLASS-1002', 'CLASS-1006'], classes: 2 },
  { code: 'KIDS-START', name: 'Kids Starter', level: 'Starter', duration: '48 buổi', tuition: '15.200.000đ', classIds: ['CLASS-1003'], classes: 1 },
  { code: 'COMM-BIZ', name: 'Business Communication', level: 'B1+', duration: '24 buổi', tuition: '9.500.000đ', classIds: [], classes: 0 },
]

export const classes = [
  { id: 'CLASS-1001', name: 'IELTS FD 08A', courseCode: 'IELTS-FD', course: 'IELTS Foundation', teacher: 'Ms. Linh', schedule: 'T2-T4 18:30', students: '16/20', room: 'Room 2' },
  { id: 'CLASS-1002', name: 'IELTS INT 07B', courseCode: 'IELTS-INT', course: 'IELTS Intermediate', teacher: 'Mr. Nam', schedule: 'T3-T5 19:00', students: '14/18', room: 'Room 4' },
  { id: 'CLASS-1003', name: 'Kids Starter 06C', courseCode: 'KIDS-START', course: 'Kids Starter', teacher: 'Ms. Hạnh', schedule: 'T7-CN 09:00', students: '18/20', room: 'Room 1' },
  { id: 'CLASS-1004', name: 'IELTS FD 09B', courseCode: 'IELTS-FD', course: 'IELTS Foundation', teacher: 'Ms. Linh', schedule: 'T3-T5 17:30', students: '12/20', room: 'Room 5' },
  { id: 'CLASS-1005', name: 'IELTS FD 10C', courseCode: 'IELTS-FD', course: 'IELTS Foundation', teacher: 'Ms. Thảo', schedule: 'T7-CN 14:00', students: '20/20', room: 'Room 3' },
  { id: 'CLASS-1006', name: 'IELTS INT 08A', courseCode: 'IELTS-INT', course: 'IELTS Intermediate', teacher: 'Mr. Nam', schedule: 'T2-T4 19:30', students: '10/18', room: 'Room 6' },
]

export const placementTests = [
  { id: 'TEST-1001', customerId: 'KH-1024', candidateId: 'UV-1001', courseCode: 'IELTS-FD', customer: 'Nguyễn Minh Anh', date: '2026-08-08', score: '42/60', level: 'A2', recommendation: 'IELTS Foundation', status: 'Chờ đánh giá' },
  { id: 'TEST-1002', customerId: 'KH-1025', candidateId: 'UV-1002', courseCode: 'IELTS-INT', customer: 'Trần Quốc Bảo', date: '2026-08-06', score: '51/60', level: 'B1', recommendation: 'IELTS Intermediate', status: 'Đã tư vấn' },
  { id: 'TEST-1003', customerId: 'KH-1027', candidateId: 'UV-1004', courseCode: 'KIDS-START', customer: 'Phạm Đức Huy', date: '2026-08-05', score: '29/60', level: 'A1', recommendation: 'Kids Starter', status: 'Cần gọi lại' },
]

export const enrollments = [
  { id: 'ENR-1001', customerId: 'KH-1026', courseCode: 'IELTS-INT', classId: 'CLASS-1002', tuitionAfterDiscount: '22.800.000đ', status: 'Đã đăng ký' },
]

export const todayTasks = [
  { id: 'TASK-1001', customerId: 'KH-1024', content: 'Gọi 12 ứng viên mới từ Facebook Ads' },
  { id: 'TASK-1002', customerId: 'KH-1025', content: 'Xác nhận 6 lịch test đầu vào' },
  { id: 'TASK-1003', customerId: 'KH-1027', content: 'Gửi báo giá học phí cho nhóm phụ huynh Kids' },
  { id: 'TASK-1004', customerId: 'KH-1026', content: 'Theo dõi 3 hợp đồng chưa ký' },
]

export const profileStats = [
  { label: 'KPI hoàn thành', value: '86%' },
  { label: 'Ứng viên đã gọi', value: '86' },
  { label: 'Khách hàng chốt', value: '19' },
  { label: 'Tỷ lệ chuyển đổi', value: '32%' },
]
