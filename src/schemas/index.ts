import { z } from 'zod'

export const weekDays = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
] as const

export const WeekDaySchema = z.enum(weekDays)

export type WeekDay = z.infer<typeof WeekDaySchema>

export const ErrorSchema = z.object({
  error: z.string(),
  code: z.string(),
})

export const WorkoutExerciseInputSchema = z.object({
  order: z.number().int().min(0),
  name: z.string().trim().min(1),
  sets: z.number().int().min(1),
  reps: z.number().int().min(1),
  restTimeInSeconds: z.number().int().min(1),
})

export const WorkoutDayInputSchema = z.object({
  name: z.string().trim().min(1),
  weekDay: WeekDaySchema,
  isRest: z.boolean().default(false),
  estimatedDurationInSeconds: z.number().int().min(1),
  coverImageUrl: z.url().optional(),
  exercises: z.array(WorkoutExerciseInputSchema),
})

export const CreateWorkoutPlanBodySchema = z.object({
  name: z.string().trim().min(1),
  workoutDays: z.array(WorkoutDayInputSchema).min(1),
})

export const WorkoutPlanSchema = CreateWorkoutPlanBodySchema.extend({
  id: z.uuid(),
})

export const ListWorkoutPlansQuerySchema = z.object({
  active: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .optional(),
})

export const UpsertUserTrainDataBodySchema = z.object({
  userName: z.string().trim().min(1).optional(),
  weightInGrams: z.number().int().min(0),
  heightInCentimeters: z.number().int().min(0),
  age: z.number().int().min(0),
  bodyFatPercentage: z.number().int().min(0).max(100),
})

export const UpdateWorkoutSessionBodySchema = z.object({
  completedAt: z.iso.datetime(),
})

export const StartWorkoutSessionSchema = z.object({
  userWorkoutSessionId: z.uuid(),
})

export const WorkoutPlanParamsSchema = z.object({
  workoutPlanId: z.uuid(),
})

export const WorkoutDayParamsSchema = WorkoutPlanParamsSchema.extend({
  workoutDayId: z.uuid(),
})

export const WorkoutSessionParamsSchema = WorkoutDayParamsSchema.extend({
  sessionId: z.uuid(),
})

export const HomeParamsSchema = z.object({
  date: z.string().date(),
})

export const StatsQuerySchema = z.object({
  from: z.string().date(),
  to: z.string().date(),
})

export type CreateWorkoutPlanBody = z.infer<typeof CreateWorkoutPlanBodySchema>
export type ListWorkoutPlansQuery = z.infer<typeof ListWorkoutPlansQuerySchema>
export type UpsertUserTrainDataBody = z.infer<
  typeof UpsertUserTrainDataBodySchema
>
