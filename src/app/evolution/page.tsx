import { CheckCircle2, Flame, Hourglass, PercentCircle } from 'lucide-react'
import dayjs from 'dayjs'

import { BottomNav } from '@/components/bottom-nav'
import { fetchApi } from '@/lib/api'

interface StatsData {
  workoutStreak: number
  consistencyByDay: Record<
    string,
    {
      workoutDayCompleted: boolean
      workoutDayStarted: boolean
    }
  >
  completedWorkoutsCount: number
  conclusionRate: number
  totalTimeInSeconds: number
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
    <div className="flex flex-col items-center text-center">
      <span className="text-2xl font-semibold leading-[1.15]">{value}</span>
      <span className="mt-1 text-xs text-muted-foreground">{label}</span>
    </div>
  </div>
)

const EvolutionPage = async () => {
  let stats: StatsData | null = null

  try {
    const from = dayjs().subtract(5, 'month').startOf('month').format('YYYY-MM-DD')
    const to = dayjs().endOf('month').format('YYYY-MM-DD')
    stats = await fetchApi<StatsData>(`/stats?from=${from}&to=${to}`)
  } catch (error) {
    console.error(error)
  }

  const workoutStreak = stats?.workoutStreak || 0
  const completedWorkoutsCount = stats?.completedWorkoutsCount || 0
  const conclusionRate = stats?.conclusionRate || 0
  const totalTimeInSeconds = stats?.totalTimeInSeconds || 0

  const hours = Math.floor(totalTimeInSeconds / 3600)
  const minutes = Math.floor((totalTimeInSeconds % 3600) / 60)

  const weeksData: Array<{ month: string; data: number[] }> = []
  const today = dayjs()

  for (let w = 4; w >= 0; w--) {
    const weekStart = today.subtract(w, 'week').startOf('week')
    const weekDays: number[] = []
    for (let d = 0; d < 7; d++) {
      const dateStr = weekStart.add(d, 'day').format('YYYY-MM-DD')
      const dayData = stats?.consistencyByDay?.[dateStr]
      const level = dayData?.workoutDayCompleted
        ? 2
        : dayData?.workoutDayStarted
          ? 1
          : 0
      weekDays.push(level)
    }
    weeksData.push({ month: weekStart.format('MMM'), data: weekDays })
  }

  const isHotStreak = workoutStreak > 0

  return (
    <div className="flex min-h-screen flex-col bg-background pb-24 text-foreground">
      <header className="flex h-14 items-center p-5">
        <h1 className="text-[22px] font-black uppercase tracking-tighter">
          FIT.AI
        </h1>
      </header>

      <main className="flex flex-1 flex-col items-center gap-6 p-5 pt-0">
        <div
          className={`relative flex h-[220px] w-full flex-col items-center justify-center overflow-hidden rounded-xl p-8 ${
            isHotStreak
              ? 'bg-gradient-to-br from-orange-400 via-streak to-red-700'
              : 'bg-gradient-to-br from-zinc-600 via-zinc-800 to-black'
          }`}
        >
          <div className="relative z-20 flex flex-col items-center gap-3 text-white">
            <div className="flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/10 backdrop-blur-sm">
              <Flame className="size-6 text-white" fill="currentColor" />
            </div>
            <div className="flex flex-col items-center">
              <h2 className="text-[48px] font-semibold leading-[0.95]">
                {workoutStreak} dias
              </h2>
              <p className="mt-1 text-white/60">Sequência Atual</p>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3">
          <h3 className="text-[18px] font-semibold leading-[1.4]">
            Consistência
          </h3>
          <div className="no-scrollbar flex justify-between gap-1 overflow-x-auto rounded-xl border border-border p-5">
            {weeksData.map((col, i) => (
              <div
                key={i}
                className="flex min-w-[20px] flex-col items-center gap-1"
              >
                <span className="mb-1 text-[10px] text-muted-foreground">
                  {col.month}
                </span>
                {col.data.map((level, j) => (
                  <div
                    key={j}
                    className={`size-5 rounded-md ${
                      level === 2
                        ? 'bg-primary'
                        : level === 1
                          ? 'bg-primary/20'
                          : 'border border-border'
                    }`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-2 grid w-full grid-cols-2 gap-3">
          <StatCard
            icon={<CheckCircle2 className="size-4" />}
            value={String(completedWorkoutsCount)}
            label="Treinos Feitos"
          />
          <StatCard
            icon={<PercentCircle className="size-4" />}
            value={`${Math.round(conclusionRate * 100)}%`}
            label="Taxa de conclusão"
          />
        </div>

        <div className="flex w-full flex-col items-center justify-center gap-4 rounded-xl bg-primary/5 p-5">
          <div className="flex size-[34px] items-center justify-center rounded-full bg-primary/10 text-primary">
            <Hourglass className="size-4" />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-semibold leading-[1.15]">
              {hours}h{minutes}m
            </span>
            <span className="mt-1 text-xs text-muted-foreground">
              Tempo Total
            </span>
          </div>
        </div>
      </main>

      <BottomNav active="evolution" />
    </div>
  )
}

export default EvolutionPage
