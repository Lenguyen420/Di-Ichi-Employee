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
import { menuItemData } from '../../datas/appStaticData.js'

const menuIcons = {
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  ScrollText,
  UserRound,
  UsersRound,
}

export const menuItems = menuItemData.map((item) => ({
  ...item,
  icon: menuIcons[item.icon],
}))
