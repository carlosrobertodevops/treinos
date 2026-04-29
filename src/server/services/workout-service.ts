import { and, count, desc, eq, gte, isNull, lte } from 'drizzle-orm'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

import { db } from '../../db/client'
import {
  userTrainData,
  workoutDays,
  workoutExercises,
  workoutPlans,
  workoutSessions,
} from '../../db/schema'
import {
  NotFoundError,
  SessionAlreadyStartedError,
  WorkoutPlanNotActiveError,
} from '../../errors'
import type {
  CreateWorkoutPlanBody,
  ListWorkoutPlansQuery,
  UpsertUserTrainDataBody,
} from '../../schemas'

export const listWorkoutPlans = async ({
  userId,
  query,
}: {
  userId: string
  query: ListWorkoutPlansQuery
}) => {
  const rows = await db.query.workoutPlans.findMany({
    where:
      query.active === undefined
        ? eq(workoutPlans.userId, userId)
        : and(
            eq(workoutPlans.userId, userId),
            eq(workoutPlans.isActive, query.active),
          ),
    with: {
      workoutDays: {
        with: {
          exercises: true,
        },
      },
    },
    orderBy: [desc(workoutPlans.createdAt)],
  })

  return rows.map((plan) => ({
    id: plan.id,
    name: plan.name,
    isActive: plan.isActive,
    workoutDays: plan.workoutDays.map((day) => ({
      id: day.id,
      name: day.name,
      weekDay: day.weekDay,
      isRest: day.isRest,
      estimatedDurationInSeconds: day.estimatedDurationInSeconds,
      coverImageUrl: day.coverImageUrl ?? undefined,
      exercises: day.exercises
        .sort((left, right) => left.order - right.order)
        .map((exercise) => ({
          id: exercise.id,
          order: exercise.order,
          name: exercise.name,
          sets: exercise.sets,
          reps: exercise.reps,
          restTimeInSeconds: exercise.restTimeInSeconds,
        })),
    })),
  }))
}

export const createWorkoutPlan = async ({
  userId,
  body,
}: {
  userId: string
  body: CreateWorkoutPlanBody
}) => {
  return db.transaction(async (tx) => {
    await tx
      .update(workoutPlans)
      .set({ isActive: false, updatedAt: new Date() })
      .where(
        and(eq(workoutPlans.userId, userId), eq(workoutPlans.isActive, true)),
      )

    const [plan] = await tx
      .insert(workoutPlans)
      .values({ userId, name: body.name, isActive: true })
      .returning()

    if (!plan) {
      throw new NotFoundError('Workout plan not created')
    }

    const createdDays = await tx
      .insert(workoutDays)
      .values(
        body.workoutDays.map((day) => ({
          workoutPlanId: plan.id,
          name: day.name,
          weekDay: day.weekDay,
          isRest: day.isRest,
          estimatedDurationInSeconds: day.estimatedDurationInSeconds,
          coverImageUrl: day.coverImageUrl,
        })),
      )
      .returning()

    const exerciseValues = createdDays.flatMap((day, dayIndex) =>
      body.workoutDays[dayIndex].exercises.map((exercise) => ({
        workoutDayId: day.id,
        order: exercise.order,
        name: exercise.name,
        sets: exercise.sets,
        reps: exercise.reps,
        restTimeInSeconds: exercise.restTimeInSeconds,
      })),
    )

    const createdExercises = exerciseValues.length
      ? await tx.insert(workoutExercises).values(exerciseValues).returning()
      : []

    return {
      id: plan.id,
      name: plan.name,
      workoutDays: createdDays.map((day) => ({
        name: day.name,
        weekDay: day.weekDay,
        isRest: day.isRest,
        estimatedDurationInSeconds: day.estimatedDurationInSeconds,
        coverImageUrl: day.coverImageUrl ?? undefined,
        exercises: createdExercises
          .filter((exercise) => exercise.workoutDayId === day.id)
          .sort((left, right) => left.order - right.order)
          .map((exercise) => ({
            order: exercise.order,
            name: exercise.name,
            sets: exercise.sets,
            reps: exercise.reps,
            restTimeInSeconds: exercise.restTimeInSeconds,
          })),
      })),
    }
  })
}

export const getWorkoutPlan = async ({
  userId,
  workoutPlanId,
}: {
  userId: string
  workoutPlanId: string
}) => {
  const plan = await db.query.workoutPlans.findFirst({
    where: and(
      eq(workoutPlans.id, workoutPlanId),
      eq(workoutPlans.userId, userId),
    ),
    with: {
      workoutDays: true,
    },
  })

  if (!plan) {
    throw new NotFoundError('Workout plan not found')
  }

  const exerciseCounts = await db
    .select({ workoutDayId: workoutExercises.workoutDayId, count: count() })
    .from(workoutExercises)
    .groupBy(workoutExercises.workoutDayId)

  return {
    id: plan.id,
    name: plan.name,
    workoutDays: plan.workoutDays.map((day) => ({
      id: day.id,
      weekDay: day.weekDay,
      name: day.name,
      isRest: day.isRest,
      coverImageUrl: day.coverImageUrl ?? undefined,
      estimatedDurationInSeconds: day.estimatedDurationInSeconds,
      exercisesCount:
        exerciseCounts.find((item) => item.workoutDayId === day.id)?.count ?? 0,
    })),
  }
}

export const startWorkoutSession = async ({
  userId,
  workoutPlanId,
  workoutDayId,
}: {
  userId: string
  workoutPlanId: string
  workoutDayId: string
}) => {
  const plan = await db.query.workoutPlans.findFirst({
    where: and(
      eq(workoutPlans.id, workoutPlanId),
      eq(workoutPlans.userId, userId),
    ),
  })

  if (!plan) {
    throw new NotFoundError('Workout plan not found')
  }

  if (!plan.isActive) {
    throw new WorkoutPlanNotActiveError('Workout plan is not active')
  }

  const day = await db.query.workoutDays.findFirst({
    where: and(
      eq(workoutDays.id, workoutDayId),
      eq(workoutDays.workoutPlanId, workoutPlanId),
    ),
  })

  if (!day) {
    throw new NotFoundError('Workout day not found')
  }

  const existingSession = await db.query.workoutSessions.findFirst({
    where: and(
      eq(workoutSessions.workoutDayId, workoutDayId),
      isNull(workoutSessions.completedAt),
    ),
  })

  if (existingSession) {
    throw new SessionAlreadyStartedError(
      'A session has already been started for this day',
    )
  }

  const [session] = await db
    .insert(workoutSessions)
    .values({ workoutDayId, startedAt: new Date() })
    .returning({ id: workoutSessions.id })

  if (!session) {
    throw new NotFoundError('Workout session not created')
  }

  return { userWorkoutSessionId: session.id }
}

export const updateWorkoutSession = async ({
  userId,
  workoutPlanId,
  workoutDayId,
  sessionId,
  completedAt,
}: {
  userId: string
  workoutPlanId: string
  workoutDayId: string
  sessionId: string
  completedAt: string
}) => {
  const plan = await db.query.workoutPlans.findFirst({
    where: and(
      eq(workoutPlans.id, workoutPlanId),
      eq(workoutPlans.userId, userId),
    ),
  })

  if (!plan) {
    throw new NotFoundError('Workout plan not found')
  }

  const [session] = await db
    .update(workoutSessions)
    .set({ completedAt: new Date(completedAt), updatedAt: new Date() })
    .where(
      and(
        eq(workoutSessions.id, sessionId),
        eq(workoutSessions.workoutDayId, workoutDayId),
      ),
    )
    .returning({
      id: workoutSessions.id,
      startedAt: workoutSessions.startedAt,
      completedAt: workoutSessions.completedAt,
    })

  if (!session) {
    throw new NotFoundError('Workout session not found')
  }

  return {
    id: session.id,
    startedAt: session.startedAt.toISOString(),
    completedAt: session.completedAt?.toISOString(),
  }
}

export const upsertUserTrainData = async ({
  userId,
  body,
}: {
  userId: string
  body: UpsertUserTrainDataBody
}) => {
  const [result] = await db
    .insert(userTrainData)
    .values({
      userId,
      userName: body.userName ?? 'Atleta',
      weightInGrams: body.weightInGrams,
      heightInCentimeters: body.heightInCentimeters,
      age: body.age,
      bodyFatPercentage: body.bodyFatPercentage,
    })
    .onConflictDoUpdate({
      target: userTrainData.userId,
      set: {
        userName: body.userName ?? 'Atleta',
        weightInGrams: body.weightInGrams,
        heightInCentimeters: body.heightInCentimeters,
        age: body.age,
        bodyFatPercentage: body.bodyFatPercentage,
        updatedAt: new Date(),
      },
    })
    .returning()

  return result
}

export const getUserTrainData = async ({ userId }: { userId: string }) => {
  return db.query.userTrainData.findFirst({
    where: eq(userTrainData.userId, userId),
  })
}

export const getWorkoutDayDetailed = async ({
  userId,
  workoutPlanId,
  workoutDayId,
}: {
  userId: string
  workoutPlanId: string
  workoutDayId: string
}) => {
  const plan = await db.query.workoutPlans.findFirst({
    where: and(
      eq(workoutPlans.id, workoutPlanId),
      eq(workoutPlans.userId, userId),
    ),
  })

  if (!plan) {
    throw new NotFoundError('Workout plan not found')
  }

  const day = await db.query.workoutDays.findFirst({
    where: and(
      eq(workoutDays.id, workoutDayId),
      eq(workoutDays.workoutPlanId, workoutPlanId),
    ),
    with: {
      exercises: {
        orderBy: (exercises, { asc }) => [asc(exercises.order)],
      },
      sessions: {
        orderBy: (sessions, { desc }) => [desc(sessions.startedAt)],
      },
    },
  })

  if (!day) {
    throw new NotFoundError('Workout day not found')
  }

  return {
    id: day.id,
    name: day.name,
    isRest: day.isRest,
    coverImageUrl: day.coverImageUrl ?? undefined,
    estimatedDurationInSeconds: day.estimatedDurationInSeconds,
    exercises: day.exercises,
    weekDay: day.weekDay,
    sessions: day.sessions.map((s) => ({
      id: s.id,
      workoutDayId: s.workoutDayId,
      startedAt: s.startedAt.toISOString(),
      completedAt: s.completedAt?.toISOString(),
    })),
  }
}

export const getHomeData = async ({
  userId,
  date,
}: {
  userId: string
  date: string
}) => {
  const targetDate = dayjs(date).utc()
  const startOfWeek = targetDate.startOf('week') // Sunday
  const endOfWeek = targetDate.endOf('week') // Saturday

  const plan = await db.query.workoutPlans.findFirst({
    where: and(
      eq(workoutPlans.userId, userId),
      eq(workoutPlans.isActive, true),
    ),
    with: {
      workoutDays: {
        with: { exercises: true },
      },
    },
  })

  if (!plan) {
    throw new NotFoundError('Active workout plan not found')
  }

  const weekDayMap: Record<number, string> = {
    0: 'SUNDAY',
    1: 'MONDAY',
    2: 'TUESDAY',
    3: 'WEDNESDAY',
    4: 'THURSDAY',
    5: 'FRIDAY',
    6: 'SATURDAY',
  }
  const currentWeekDayEnum = weekDayMap[targetDate.day()]
  const todayDay = plan.workoutDays.find(
    (d) => d.weekDay === currentWeekDayEnum,
  )

  const sessions = await db.query.workoutSessions.findMany({
    where: and(
      gte(workoutSessions.startedAt, startOfWeek.toDate()),
      lte(workoutSessions.startedAt, endOfWeek.toDate()),
    ),
    with: {
      workoutDay: {
        with: { workoutPlan: true },
      },
    },
  })

  // Filter sessions that belong to the user's active plan
  const userSessions = sessions.filter(
    (s) => s.workoutDay.workoutPlan.userId === userId,
  )

  const consistencyByDay: Record<
    string,
    { workoutDayCompleted: boolean; workoutDayStarted: boolean }
  > = {}

  // Fill consistency with all days of the week
  for (let i = 0; i < 7; i++) {
    const dayStr = startOfWeek.add(i, 'day').format('YYYY-MM-DD')
    consistencyByDay[dayStr] = {
      workoutDayCompleted: false,
      workoutDayStarted: false,
    }
  }

  for (const session of userSessions) {
    const dayStr = dayjs(session.startedAt).utc().format('YYYY-MM-DD')
    if (consistencyByDay[dayStr]) {
      consistencyByDay[dayStr].workoutDayStarted = true
      if (session.completedAt) {
        consistencyByDay[dayStr].workoutDayCompleted = true
      }
    }
  }

  // Calculate streak: consecutive days completed going backwards from today
  let streak = 0
  for (let i = 0; i < 7; i++) {
    const dayStr = targetDate.subtract(i, 'day').format('YYYY-MM-DD')
    if (consistencyByDay[dayStr]?.workoutDayCompleted) {
      streak++
    } else if (i !== 0) {
      break
    }
  }

  return {
    activeWorkoutPlanId: plan.id,
    todayWorkoutDay: todayDay
      ? {
          id: todayDay.id,
          workoutPlanId: plan.id,
          name: todayDay.name,
          isRest: todayDay.isRest,
          weekDay: todayDay.weekDay,
          estimatedDurationInSeconds: todayDay.estimatedDurationInSeconds,
          coverImageUrl: todayDay.coverImageUrl ?? undefined,
          exercisesCount: todayDay.exercises.length,
        }
      : null,
    workoutStreak: streak,
    consistencyByDay,
  }
}

export const getStats = async ({
  userId,
  from,
  to,
}: {
  userId: string
  from: string
  to: string
}) => {
  const startDate = dayjs(from).utc().startOf('day').toDate()
  const endDate = dayjs(to).utc().endOf('day').toDate()

  const sessions = await db.query.workoutSessions.findMany({
    where: and(
      gte(workoutSessions.startedAt, startDate),
      lte(workoutSessions.startedAt, endDate),
    ),
    with: {
      workoutDay: {
        with: { workoutPlan: true },
      },
    },
  })

  const userSessions = sessions.filter(
    (s) => s.workoutDay.workoutPlan.userId === userId,
  )

  const consistencyByDay: Record<
    string,
    { workoutDayCompleted: boolean; workoutDayStarted: boolean }
  > = {}

  let completedWorkoutsCount = 0
  let totalTimeInSeconds = 0

  for (const session of userSessions) {
    const dayStr = dayjs(session.startedAt).utc().format('YYYY-MM-DD')

    if (!consistencyByDay[dayStr]) {
      consistencyByDay[dayStr] = {
        workoutDayCompleted: false,
        workoutDayStarted: false,
      }
    }

    consistencyByDay[dayStr].workoutDayStarted = true

    if (session.completedAt) {
      consistencyByDay[dayStr].workoutDayCompleted = true
      completedWorkoutsCount++
      const diff = dayjs(session.completedAt).diff(
        dayjs(session.startedAt),
        'second',
      )
      totalTimeInSeconds += diff
    }
  }

  // Calculate streak from all history to be accurate, but here just use the filtered range
  let workoutStreak = 0
  const today = dayjs().utc().startOf('day')
  // We can calculate streak going backwards from today based on the map
  for (let i = 0; i < 365; i++) {
    const dayStr = today.subtract(i, 'day').format('YYYY-MM-DD')
    if (consistencyByDay[dayStr]?.workoutDayCompleted) {
      workoutStreak++
    } else if (i !== 0 && consistencyByDay[dayStr] === undefined) {
      // we only break if it's undefined and not today,
      // though the prompt says to count sequence of completed days
      break
    }
  }

  const conclusionRate =
    userSessions.length > 0 ? completedWorkoutsCount / userSessions.length : 0

  return {
    workoutStreak,
    consistencyByDay,
    completedWorkoutsCount,
    conclusionRate,
    totalTimeInSeconds,
  }
}
