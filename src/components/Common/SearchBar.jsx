import { Search } from 'lucide-react'

export const SearchBar = ({ placeholder = 'Tìm kiếm...' }) => (
  <label className="relative block w-full">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400" size={18} />
    <input className="h-11 w-full rounded-xl border border-orange-100 bg-white pl-10 pr-3 text-sm outline-none ring-orange-100 transition focus:border-orange-300 focus:ring-4" placeholder={placeholder} />
  </label>
)
