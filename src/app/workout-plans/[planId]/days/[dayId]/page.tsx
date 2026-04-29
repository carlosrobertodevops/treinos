import {
  Calendar,
  ChevronLeft,
  Dumbbell,
  HelpCircle,
  Timer,
  Zap,
} from 'lucide-react'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { BottomNav } from '@/components/bottom-nav'
import { fetchApi } from '@/lib/api'

interface WorkoutDayDetailed {
  id: string
  name: string
  isRest: boolean
  coverImageUrl?: string
  estimatedDurationInSeconds: number
  exercises: Array<{
    id: string
    order: number
    name: string
    sets: number
    reps: number
    restTimeInSeconds: number
  }>
  weekDay: string
  sessions: Array<{
    id: string
    workoutDayId: string
    startedAt: string
    completedAt?: string
  }>
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

interface PageProps {
  params: Promise<{ planId: string; dayId: string }>
}

const WorkoutPlanDayPage = async ({ params }: PageProps) => {
  const { planId, dayId } = await params

  let day: WorkoutDayDetailed | null = null

  try {
    day = await fetchApi<WorkoutDayDetailed>(
      `/workout-plans/${planId}/days/${dayId}`,
    )
  } catch (error) {
    console.error(error)
  }

  if (!day) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background pb-24 text-foreground">
        <p className="text-muted-foreground">Dia de treino não encontrado.</p>
        <Link href="/workout-plans" className="mt-4 text-primary">
          Voltar para os planos
        </Link>
      </div>
    )
  }

  const weekDayPt = WEEK_DAYS_PT[day.weekDay] || day.weekDay
  const isActiveSession =
    day.sessions.length > 0 && !day.sessions[0].completedAt

  return (
    <div className="flex min-h-screen flex-col bg-background pb-24 text-foreground">
      <header className="flex items-center justify-between border-b border-border p-5">
        <Link href="/workout-plans" className="-ml-1 p-1">
          <ChevronLeft className="size-6 text-foreground" />
        </Link>
        <h1 className="text-[18px] font-semibold capitalize leading-[1.4]">
          {weekDayPt.toLowerCase()}
        </h1>
        <div className="size-6" />
      </header>

      <main className="flex flex-1 flex-col gap-4 p-5">
        <div className="relative flex h-[200px] w-full flex-col justify-between overflow-hidden rounded-xl p-5">
          <div className="absolute inset-0 z-0 bg-zinc-900">
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
            <img
              src={
                day.coverImageUrl ||
                'http://localhost:3845/assets/c44110f507b4b7a0e0cc715e08be6dc8c52aadf1.png'
              }
              alt=""
              aria-hidden
              className="size-full object-cover opacity-80"
            />
          </div>

          <div className="relative z-20 flex justify-start">
            <Badge className="flex items-center gap-1 rounded-full border-none bg-white/20 px-3 py-1 text-white backdrop-blur-md hover:bg-white/20">
              <Calendar className="size-3.5" />
              <span className="text-xs font-semibold uppercase">
                {weekDayPt}
              </span>
            </Badge>
          </div>

          <div className="relative z-20 flex w-full items-end justify-between">
            <div className="flex flex-col gap-2 text-white">
              <h2 className="text-2xl font-semibold leading-[1.05]">
                {day.name}
              </h2>
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

            {day.isRest ? (
              <Button
                disabled
                className="h-10 rounded-full bg-white/20 px-5 text-sm font-semibold text-white"
              >
                Descanso
              </Button>
            ) : isActiveSession ? (
              <Button className="h-10 rounded-full bg-streak px-5 text-sm font-semibold text-white hover:bg-streak/90">
                Em Andamento
              </Button>
            ) : (
              <Button className="h-10 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                Iniciar Treino
              </Button>
            )}
          </div>
        </div>

        {!day.isRest && (
          <div className="mt-2 flex flex-col gap-3">
            {day.exercises.map((exercise) => (
              <Card key={exercise.id} className="border-border shadow-none">
                <CardContent className="flex flex-col gap-3 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold">{exercise.name}</h3>
                    <button className="text-muted-foreground" aria-label="Ajuda">
                      <HelpCircle className="size-5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-secondary px-2.5 py-1 text-[10px] font-semibold uppercase text-muted-foreground hover:bg-secondary">
                      {exercise.sets} SÉRIES
                    </Badge>
                    <Badge className="bg-secondary px-2.5 py-1 text-[10px] font-semibold uppercase text-muted-foreground hover:bg-secondary">
                      {exercise.reps} REPS
                    </Badge>
                    <Badge className="flex items-center gap-1 bg-secondary px-2.5 py-1 text-[10px] font-semibold uppercase text-muted-foreground hover:bg-secondary">
                      <Zap className="size-3" />
                      {exercise.restTimeInSeconds}S
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <BottomNav active="plans" />
    </div>
  )
}

export default WorkoutPlanDayPage
