import {
  Home,
  Calendar,
  Sparkles,
  BarChart2,
  User,
  Timer,
  Dumbbell,
  Zap,
  Target,
} from 'lucide-react'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { fetchApi } from '@/lib/api'

interface WorkoutPlan {
  id: string
  name: string
  isActive: boolean
  workoutDays: {
    id: string
    name: string
    weekDay: string
    isRest: boolean
    estimatedDurationInSeconds: number
    coverImageUrl?: string
    exercises: {
      id: string
      order: number
      name: string
      sets: number
      reps: number
      restTimeInSeconds: number
    }[]
  }[]
}

const WEEK_DAYS_ORDER: Record<string, number> = {
  MONDAY: 0,
  TUESDAY: 1,
  WEDNESDAY: 2,
  THURSDAY: 3,
  FRIDAY: 4,
  SATURDAY: 5,
  SUNDAY: 6,
}

const WEEK_DAYS_PT: Record<string, string> = {
  MONDAY: 'SEGUNDA',
  TUESDAY: 'TERÇA',
  WEDNESDAY: 'QUARTA',
  THURSDAY: 'QUINTA',
  FRIDAY: 'SEXTA',
  SATURDAY: 'SÁBADO',
  SUNDAY: 'DOMINGO',
}

const WorkoutPlansPage = async () => {
  let plans: WorkoutPlan[] = []

  try {
    plans = await fetchApi<WorkoutPlan[]>('/workout-plans?active=true')
  } catch (error) {
    console.error(error)
  }

  const activePlan = plans[0]

  const sortedDays = activePlan?.workoutDays
    ? [...activePlan.workoutDays].sort(
        (a, b) =>
          (WEEK_DAYS_ORDER[a.weekDay] ?? 9) -
          (WEEK_DAYS_ORDER[b.weekDay] ?? 9),
      )
    : []

  return (
    <div className="flex min-h-screen flex-col bg-background pb-24 text-foreground">
      <div className="relative flex h-[240px] w-full flex-col justify-between overflow-hidden rounded-b-3xl p-5">
        <div className="absolute inset-0 z-0 bg-zinc-900">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 to-transparent" />
          <img
            src="/figma/8178ff0f02a6904d7f2933ba70a67051b3bf022a.png"
            alt="Plano"
            className="size-full object-cover opacity-80"
          />
        </div>

        <div className="relative z-20">
          <h1 className="text-[22px] font-black uppercase tracking-tighter text-white">
            FIT.AI
          </h1>
        </div>

        <div className="relative z-20 flex flex-col gap-2 text-white">
          {activePlan && (
            <Badge className="flex w-fit items-center gap-1 rounded-full border-none bg-primary px-3 py-1 text-white hover:bg-primary">
              <Target className="size-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wide">
                {activePlan.name}
              </span>
            </Badge>
          )}
          <h2 className="text-[28px] font-semibold leading-[1.05]">
            Plano de Treino
          </h2>
        </div>
      </div>

      <main className="flex flex-1 flex-col gap-4 p-5">
        {!activePlan && (
          <div className="py-10 text-center text-muted-foreground">
            Nenhum plano de treino ativo no momento.
          </div>
        )}

        {sortedDays.map((day) =>
          day.isRest ? (
            <div
              key={day.id}
              className="flex h-[110px] flex-col justify-between rounded-xl bg-secondary p-5"
            >
              <Badge className="flex w-fit items-center gap-1 rounded-full border-none bg-black/5 px-3 py-1 text-foreground shadow-none hover:bg-black/5">
                <Calendar className="size-3.5" />
                <span className="text-[10px] font-bold uppercase">
                  {WEEK_DAYS_PT[day.weekDay] || day.weekDay}
                </span>
              </Badge>
              <div className="flex items-center gap-2">
                <Zap className="size-5 text-primary" fill="currentColor" />
                <h3 className="text-2xl font-semibold leading-none">
                  {day.name}
                </h3>
              </div>
            </div>
          ) : (
            <Link
              key={day.id}
              href={`/workout-plans/${activePlan.id}/days/${day.id}`}
              className="group relative flex h-[200px] w-full flex-col justify-between overflow-hidden rounded-xl p-5"
            >
              <div className="absolute inset-0 z-0 bg-zinc-900">
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
                <img
                  src={
                    day.coverImageUrl ||
                    '/figma/c44110f507b4b7a0e0cc715e08be6dc8c52aadf1.png'
                  }
                  alt={day.name}
                  className="size-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="relative z-20 flex justify-start">
                <Badge className="flex items-center gap-1 rounded-full border-none bg-white/20 px-3 py-1 text-white shadow-none backdrop-blur-md hover:bg-white/20">
                  <Calendar className="size-3.5" />
                  <span className="text-[10px] font-bold uppercase">
                    {WEEK_DAYS_PT[day.weekDay] || day.weekDay}
                  </span>
                </Badge>
              </div>

              <div className="relative z-20 flex flex-col gap-2 text-white">
                <h3 className="text-2xl font-semibold leading-[1.05]">
                  {day.name}
                </h3>
                <div className="flex items-center gap-3 text-xs text-white/80">
                  <div className="flex items-center gap-1">
                    <Timer className="size-3.5" />
                    <span>
                      {Math.round(day.estimatedDurationInSeconds / 60)}min
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Dumbbell className="size-3.5" />
                    <span>{day.exercises.length} exercícios</span>
                  </div>
                </div>
              </div>
            </Link>
          ),
        )}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-between rounded-t-3xl border-t border-border bg-background px-6 py-4">
        <Link href="/home" className="p-2 text-muted-foreground">
          <Home className="size-6" />
        </Link>
        <Link href="/workout-plans" className="p-2 text-primary">
          <Calendar className="size-6" />
        </Link>
        <Link
          href="/ai/coach"
          className="-mt-8 rounded-full bg-primary p-4 text-primary-foreground shadow-lg"
        >
          <Sparkles className="size-6" fill="currentColor" />
        </Link>
        <Link href="/evolution" className="p-2 text-muted-foreground">
          <BarChart2 className="size-6" />
        </Link>
        <Link href="/profile" className="p-2 text-muted-foreground">
          <User className="size-6" />
        </Link>
      </nav>
    </div>
  )
}

export default WorkoutPlansPage
