import { Calendar, Dumbbell, Flame, Timer } from 'lucide-react'
import Link from 'next/link'
import dayjs from 'dayjs'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BottomNav } from '@/components/bottom-nav'
import { fetchApi } from '@/lib/api'

interface HomeDataResponse {
  activeWorkoutPlanId: string | null
  todayWorkoutDay: {
    id: string
    workoutPlanId: string
    name: string
    isRest: boolean
    weekDay: string
    estimatedDurationInSeconds: number
    coverImageUrl?: string
    exercisesCount: number
  } | null
  workoutStreak: number
  consistencyByDay: Record<
    string,
    {
      workoutDayCompleted: boolean
      workoutDayStarted: boolean
    }
  >
}

interface UserDataResponse {
  userName: string
}

const HomePage = async () => {
  const todayStr = dayjs().format('YYYY-MM-DD')

  let homeData: HomeDataResponse | null = null
  let userData: UserDataResponse | null = null

  try {
    userData = await fetchApi<UserDataResponse>('/me')
    homeData = await fetchApi<HomeDataResponse>(`/home/${todayStr}`)
  } catch (error) {
    console.error(error)
  }

  const userName = userData?.userName || 'Atleta'

  const sortedDates = homeData ? Object.keys(homeData.consistencyByDay).sort() : []

  const weekConsistency = sortedDates.map((dateStr) => {
    const data = homeData!.consistencyByDay[dateStr]
    const dayIndex = dayjs(dateStr).day()
    const isToday = dateStr === todayStr
    const level = data.workoutDayCompleted ? 2 : data.workoutDayStarted ? 1 : 0
    return {
      day: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'][dayIndex],
      level,
      current: isToday,
    }
  })

  return (
    <div className="flex min-h-screen flex-col bg-background pb-24 text-foreground">
      <div className="relative flex h-[280px] w-full flex-col justify-between overflow-hidden rounded-b-[24px] p-5">
        <div className="absolute inset-0 z-0 bg-zinc-900">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />
          <img
            src="/figma/cc3d9c8a89701c8dc5253d27ac69aaff0c5ab281.png"
            alt=""
            aria-hidden
            className="size-full object-cover opacity-80"
          />
        </div>

        <div className="relative z-20">
          <h1 className="text-[22px] font-black uppercase tracking-tighter text-white">
            FIT.AI
          </h1>
        </div>

        <div className="relative z-20 flex w-full items-end justify-between">
          <div className="flex flex-col gap-1 text-white">
            <h2 className="text-[28px] font-semibold leading-[1.05]">
              Olá, {userName}
            </h2>
            <p className="text-sm text-white/70">Bora treinar hoje?</p>
          </div>

          {homeData?.todayWorkoutDay && !homeData.todayWorkoutDay.isRest ? (
            <Link
              href={`/workout-plans/${homeData.todayWorkoutDay.workoutPlanId}`}
            >
              <Button className="h-10 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                Bora!
              </Button>
            </Link>
          ) : (
            <Link href="/workout-plans">
              <Button className="h-10 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                Ver Planos
              </Button>
            </Link>
          )}
        </div>
      </div>

      <main className="flex flex-1 flex-col gap-6 p-5">
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[18px] font-semibold leading-[1.4]">
              Consistência
            </h3>
            <Link href="/evolution" className="text-xs text-primary">
              Ver histórico
            </Link>
          </div>

          <div className="flex h-[90px] gap-3">
            <div className="flex flex-1 items-center justify-between rounded-xl border border-border p-4">
              {weekConsistency.length > 0 ? (
                weekConsistency.map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div
                      className={`size-5 rounded-md ${
                        item.level === 2
                          ? 'bg-primary'
                          : item.level === 1
                            ? 'bg-primary/20'
                            : item.current
                              ? 'border-2 border-primary'
                              : 'border border-border'
                      }`}
                    />
                    <span className="text-[10px] text-muted-foreground">
                      {item.day}
                    </span>
                  </div>
                ))
              ) : (
                <div className="w-full text-center text-xs text-muted-foreground">
                  Nenhum plano ativo.
                </div>
              )}
            </div>

            <div className="flex w-[80px] items-center justify-center gap-2 rounded-xl bg-streak-soft">
              <Flame className="size-5 text-streak" fill="currentColor" />
              <span className="text-lg font-semibold">
                {homeData?.workoutStreak || 0}
              </span>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[18px] font-semibold leading-[1.4]">
              Treino de Hoje
            </h3>
            <Link href="/workout-plans" className="text-xs text-primary">
              Ver treinos
            </Link>
          </div>

          {homeData?.todayWorkoutDay ? (
            homeData.todayWorkoutDay.isRest ? (
              <div className="flex h-[110px] w-full flex-col justify-between rounded-xl bg-secondary p-5">
                <Badge className="flex w-fit items-center gap-1 rounded-full border-none bg-black/5 px-3 py-1 text-foreground shadow-none hover:bg-black/5">
                  <Calendar className="size-3.5" />
                  <span className="text-[10px] font-bold uppercase">
                    {homeData.todayWorkoutDay.weekDay}
                  </span>
                </Badge>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-semibold leading-none">
                    Descanso
                  </h3>
                </div>
              </div>
            ) : (
              <div className="relative flex h-[200px] w-full flex-col justify-between overflow-hidden rounded-xl p-5">
                <div className="absolute inset-0 z-0 bg-zinc-900">
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 to-transparent" />
                  <img
                    src={
                      homeData.todayWorkoutDay.coverImageUrl ||
                      '/figma/773c1692f16475d0ed3ff30b0fa02d38f936e190.png'
                    }
                    alt=""
                    aria-hidden
                    className="size-full object-cover opacity-80"
                  />
                </div>

                <div className="relative z-20 flex justify-start">
                  <Badge className="flex items-center gap-1 rounded-full border-none bg-white/20 px-3 py-1 text-white shadow-none backdrop-blur-md hover:bg-white/20">
                    <Calendar className="size-3.5" />
                    <span className="text-[10px] font-bold uppercase">
                      {homeData.todayWorkoutDay.weekDay}
                    </span>
                  </Badge>
                </div>

                <div className="relative z-20 flex flex-col gap-2 text-white">
                  <h2 className="text-2xl font-semibold leading-[1.05]">
                    {homeData.todayWorkoutDay.name}
                  </h2>
                  <div className="flex items-center gap-3 text-xs text-white/80">
                    <div className="flex items-center gap-1">
                      <Timer className="size-3.5" />
                      <span>
                        {Math.round(
                          homeData.todayWorkoutDay.estimatedDurationInSeconds /
                            60,
                        )}
                        min
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Dumbbell className="size-3.5" />
                      <span>
                        {homeData.todayWorkoutDay.exercisesCount} exercícios
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="flex h-[110px] w-full flex-col items-center justify-center gap-2 rounded-xl bg-secondary p-5 text-muted-foreground">
              <p className="text-sm">Nenhum treino programado hoje.</p>
              <Link href="/workout-plans" className="text-xs text-primary">
                Criar um plano
              </Link>
            </div>
          )}
        </section>
      </main>

      <BottomNav active="home" />
    </div>
  )
}

export default HomePage
