import { and, count, desc, eq, isNull } from 'drizzle-orm'

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
    where: query.active === undefined
      ? eq(workoutPlans.userId, userId)
      : and(eq(workoutPlans.userId, userId), eq(workoutPlans.isActive, query.active)),
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
      .where(and(eq(workoutPlans.userId, userId), eq(workoutPlans.isActive, true)))

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
    where: and(eq(workoutPlans.id, workoutPlanId), eq(workoutPlans.userId, userId)),
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
    where: and(eq(workoutPlans.id, workoutPlanId), eq(workoutPlans.userId, userId)),
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
    where: and(eq(workoutPlans.id, workoutPlanId), eq(workoutPlans.userId, userId)),
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
