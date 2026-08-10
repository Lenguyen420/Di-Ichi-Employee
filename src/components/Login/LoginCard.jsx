import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react'
import logo from '../../assets/logo/LOGO_Diichi.webp'
import { Button } from '../Common/Button.jsx'

const employeeAccount = {
  email: 'nhanvien@di-ichi.edu.vn',
  password: '123456',
}

const normalizeEmail = (value) => value.trim().toLowerCase()

export const LoginCard = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState(employeeAccount.email)
  const [password, setPassword] = useState(employeeAccount.password)
  const [rememberLogin, setRememberLogin] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()

    const normalizedEmail = normalizeEmail(email)
    const normalizedPassword = password.trim()

    if (!normalizedEmail || !normalizedPassword) {
      toast.error('Vui lòng nhập đầy đủ thông tin đăng nhập.')
      return
    }

    if (normalizedEmail === employeeAccount.email && normalizedPassword === employeeAccount.password) {
      const employeeSession = JSON.stringify({
        email: normalizedEmail,
        role: 'employee',
      })

      if (rememberLogin) {
        localStorage.setItem('diIchiEmployeeSession', employeeSession)
      } else {
        sessionStorage.setItem('diIchiEmployeeSession', employeeSession)
      }

      toast.success('Đăng nhập thành công', {
        description: 'Chào mừng bạn quay lại Di-Ichi Employee Portal.',
      })
      navigate('/dashboard')
      return
    }

    toast.error('Đăng nhập thất bại', {
      description: 'Email hoặc mật khẩu không đúng.',
    })
  }

  return (
    <section className="mx-auto w-full max-w-md rounded-3xl border border-white/60 bg-white/90 p-6 shadow-2xl shadow-orange-950/20 backdrop-blur md:p-8">
      <div className="text-center">
        <img className="mx-auto h-28 w-28 object-contain md:h-32 md:w-32" src={logo} alt="Di-Ichi" />
        <h1 className="mt-5 text-2xl font-black text-slate-950">Đăng nhập nhân viên</h1>
        <p className="mt-2 text-sm text-slate-500">Truy cập Di-Ichi Employee để quản lý công việc, lịch làm việc và thông tin nội bộ.</p>
      </div>

      {/* <div className="mt-6 rounded-2xl border border-orange-100 bg-orange-50 p-4 text-sm">
        <p className="font-black text-orange-700">Tài khoản mặc định</p>
        <p className="mt-2 text-slate-600">Email: <span className="font-bold text-slate-900">{employeeAccount.email}</span></p>
        <p className="mt-1 text-slate-600">Password: <span className="font-bold text-slate-900">{employeeAccount.password}</span></p>
      </div> */}

      <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-sm font-bold text-slate-700">Email</span>
          <div className="mt-2 flex h-12 items-center gap-3 rounded-2xl border border-orange-100 bg-white px-4 focus-within:border-orange-300 focus-within:ring-4 focus-within:ring-orange-100">
            <Mail size={18} className="text-orange-500" />
            <input
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nhanvien@di-ichi.edu.vn"
              type="email"
              value={email}
            />
          </div>
        </label>

        <label className="block">
          <span className="text-sm font-bold text-slate-700">Mật khẩu</span>
          <div className="mt-2 flex h-12 items-center gap-3 rounded-2xl border border-orange-100 bg-white px-4 focus-within:border-orange-300 focus-within:ring-4 focus-within:ring-orange-100">
            <LockKeyhole size={18} className="text-orange-500" />
            <input
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Nhập mật khẩu"
              type={showPassword ? 'text' : 'password'}
              value={password}
            />
            <button
              type="button"
              className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-orange-50 hover:text-orange-600"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </label>

        <div className="flex items-center justify-between gap-3 text-sm">
          <label className="flex items-center gap-2 font-semibold text-slate-600">
            <input
              className="h-4 w-4 rounded border-orange-200 accent-orange-600"
              checked={rememberLogin}
              onChange={(event) => setRememberLogin(event.target.checked)}
              type="checkbox"
            />
            Ghi nhớ đăng nhập
          </label>
          <button className="font-bold text-orange-600" type="button">Quên mật khẩu?</button>
        </div>

        <Button className="w-full" type="submit">Đăng nhập</Button>
      </form>
    </section>
  )
}
