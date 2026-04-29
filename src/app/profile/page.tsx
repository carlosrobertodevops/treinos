import {
  BicepsFlexed,
  LogOut,
  Ruler,
  UserRound,
  Weight,
} from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BottomNav } from '@/components/bottom-nav'
import { fetchApi } from '@/lib/api'

interface UserData {
  userName: string
  weightInGrams: number
  heightInCentimeters: number
  age: number
  bodyFatPercentage: number
}

interface StatCardProps {
  icon: React.ReactNode
  value: string
  label: string
}

const StatCard = ({ icon, value, label }: StatCardProps) => (
  <div className="flex flex-col items-center justify-center gap-4 rounded-xl bg-primary/5 p-5">
    <div className="flex size-[34px] items-center justify-center rounded-full bg-primary/10 text-primary">
      {icon}
    </div>
    <div className="flex flex-col items-center">
      <span className="text-2xl font-semibold leading-[1.15]">{value}</span>
      <span className="mt-1 text-xs uppercase text-muted-foreground">
        {label}
      </span>
    </div>
  </div>
)

const ProfilePage = async () => {
  let userData: UserData | null = null

  try {
    userData = await fetchApi<UserData>('/me')
  } catch (error) {
    console.error(error)
  }

  const {
    userName = 'Atleta',
    weightInGrams = 0,
    heightInCentimeters = 0,
    age = 0,
    bodyFatPercentage = 0,
  } = userData || {}

  const weightKg = (weightInGrams / 1000).toFixed(1)

  return (
    <div className="flex min-h-screen flex-col bg-background pb-24 text-foreground">
      <header className="flex h-14 items-center p-5">
        <h1 className="text-[22px] font-black uppercase tracking-tighter">
          FIT.AI
        </h1>
      </header>

      <main className="flex flex-1 flex-col items-center gap-6 p-5">
        <div className="flex w-full items-center justify-start gap-3">
          <Avatar className="size-[52px]">
            <AvatarImage
              src="/figma/cf5a35513cfa4c97c008536c5d7ffacf7a4bfa49.png"
              alt={userName}
            />
            <AvatarFallback>{userName.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h2 className="text-[18px] font-semibold leading-[1.05]">
              {userName}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">Plano Básico</p>
          </div>
        </div>

        <div className="mt-2 grid w-full grid-cols-2 gap-3">
          <StatCard
            icon={<Weight className="size-4" />}
            value={weightKg}
            label="KG"
          />
          <StatCard
            icon={<Ruler className="size-4" />}
            value={String(heightInCentimeters)}
            label="CM"
          />
          <StatCard
            icon={<BicepsFlexed className="size-4" />}
            value={`${bodyFatPercentage}%`}
            label="GC"
          />
          <StatCard
            icon={<UserRound className="size-4" />}
            value={String(age)}
            label="ANOS"
          />
        </div>

        <button className="mt-4 flex items-center gap-2 rounded-full px-4 py-2 transition-colors hover:bg-destructive/10">
          <span className="text-base font-semibold text-destructive">
            Sair da conta
          </span>
          <LogOut className="size-4 text-destructive" />
        </button>
      </main>

      <BottomNav active="profile" />
    </div>
  )
}

export default ProfilePage
