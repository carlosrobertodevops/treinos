import { relations } from 'drizzle-orm'
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

import { weekDays } from '../schemas'

export const weekDayEnum = pgEnum('week_day', weekDays)

export const userTrainData = pgTable('user_train_data', {
  userId: text('user_id').primaryKey(),
  userName: text('user_name').notNull().default('Atleta'),
  weightInGrams: integer('weight_in_grams').notNull(),
  heightInCentimeters: integer('height_in_centimeters').notNull(),
  age: integer('age').notNull(),
  bodyFatPercentage: integer('body_fat_percentage').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const workoutPlans = pgTable('workout_plans', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(),
  name: text('name').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const workoutDays = pgTable('workout_days', {
  id: uuid('id').defaultRandom().primaryKey(),
  workoutPlanId: uuid('workout_plan_id')
    .notNull()
    .references(() => workoutPlans.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  isRest: boolean('is_rest').default(false).notNull(),
  weekDay: weekDayEnum('week_day').notNull(),
  estimatedDurationInSeconds: integer(
    'estimated_duration_in_seconds',
  ).notNull(),
  coverImageUrl: text('cover_image_url'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const workoutExercises = pgTable('workout_exercises', {
  id: uuid('id').defaultRandom().primaryKey(),
  workoutDayId: uuid('workout_day_id')
    .notNull()
    .references(() => workoutDays.id, { onDelete: 'cascade' }),
  order: integer('order').notNull(),
  name: text('name').notNull(),
  sets: integer('sets').notNull(),
  reps: integer('reps').notNull(),
  restTimeInSeconds: integer('rest_time_in_seconds').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const workoutSessions = pgTable('workout_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  workoutDayId: uuid('workout_day_id')
    .notNull()
    .references(() => workoutDays.id, { onDelete: 'cascade' }),
  startedAt: timestamp('started_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const workoutPlansRelations = relations(workoutPlans, ({ many }) => ({
  workoutDays: many(workoutDays),
}))

export const workoutDaysRelations = relations(workoutDays, ({ one, many }) => ({
  workoutPlan: one(workoutPlans, {
    fields: [workoutDays.workoutPlanId],
    references: [workoutPlans.id],
  }),
  exercises: many(workoutExercises),
  sessions: many(workoutSessions),
}))

export const workoutExercisesRelations = relations(
  workoutExercises,
  ({ one }) => ({
    workoutDay: one(workoutDays, {
      fields: [workoutExercises.workoutDayId],
      references: [workoutDays.id],
    }),
  }),
)

export const workoutSessionsRelations = relations(
  workoutSessions,
  ({ one }) => ({
    workoutDay: one(workoutDays, {
      fields: [workoutSessions.workoutDayId],
      references: [workoutDays.id],
    }),
  }),
)
