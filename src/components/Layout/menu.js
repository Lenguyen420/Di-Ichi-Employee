import {
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  ScrollText,
  UserRound,
  UsersRound,
} from 'lucide-react'

export const menuItems = [
  { label: 'Tổng quan', path: '/dashboard', icon: LayoutDashboard, badge: null },
  { label: 'Ứng viên tiềm năng', path: '/ung-vien-tiem-nang', icon: UsersRound, badge: '4' },
  { label: 'Lịch hẹn', path: '/lich-hen', icon: CalendarDays, badge: '18' },
  { label: 'Khóa học', path: '/khoa-hoc', icon: BookOpen, badge: null },
  { label: 'Đăng ký khóa học', path: '/dang-ky-khoa-hoc', icon: ScrollText, badge: null },
  { label: 'Lớp học', path: '/lop-hoc', icon: GraduationCap, badge: null },
  { label: 'Kiểm tra đầu vào', path: '/kiem-tra-dau-vao', icon: ClipboardCheck, badge: '3' },
  { label: 'Hồ sơ cá nhân', path: '/ho-so-ca-nhan', icon: UserRound, badge: null },
]
