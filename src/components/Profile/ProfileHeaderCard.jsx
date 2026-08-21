import { useTranslation } from 'react-i18next'
import { Card } from '../Common/Card.jsx'

export const ProfileHeaderCard = ({ profile }) => {
  const { t } = useTranslation()

  return (
    <Card className="rounded-lg">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <img className="h-24 w-24 rounded-lg object-cover ring-4 ring-orange-100" src={profile.avatar} alt={profile.name} />
        <div>
          <p className="text-sm font-bold text-orange-600">{t('Hồ sơ cá nhân')}</p>
          <h1 className="mt-1 text-3xl font-black text-slate-950">{profile.name}</h1>
          <p className="mt-1 text-sm text-slate-500">{profile.title} · {profile.email}</p>
          <p className="mt-1 text-sm font-semibold text-slate-600">{profile.phone} · {profile.branch}</p>
        </div>
      </div>
    </Card>
  )
}
