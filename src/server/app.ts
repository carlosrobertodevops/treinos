import { cors } from '@elysiajs/cors'
import { Elysia } from 'elysia'

import {
  NotFoundError,
  SessionAlreadyStartedError,
  ValidationError,
  WorkoutPlanNotActiveError,
} from '../errors'
import {
  CreateWorkoutPlanBodySchema,
  ListWorkoutPlansQuerySchema,
  UpdateWorkoutSessionBodySchema,
  UpsertUserTrainDataBodySchema,
  WorkoutDayParamsSchema,
  WorkoutPlanParamsSchema,
  WorkoutSessionParamsSchema,
} from '../schemas'
import { requireUserId } from './auth'
import {
  createWorkoutPlan,
  getUserTrainData,
  getWorkoutPlan,
  listWorkoutPlans,
  startWorkoutSession,
  updateWorkoutSession,
  upsertUserTrainData,
} from './services/workout-service'
import { parseSchema } from './validation'

export const createServer = () =>
  new Elysia()
    .use(
      cors({
        origin: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
        credentials: true,
      }),
    )
    .onError(({ error, set }) => {
      if (error instanceof ValidationError) {
        set.status = 400
        return { error: error.message, code: 'VALIDATION_ERROR' }
      }

      if (error instanceof NotFoundError) {
        set.status = 404
        return { error: error.message, code: 'NOT_FOUND_ERROR' }
      }

      if (error instanceof WorkoutPlanNotActiveError) {
        set.status = 422
        return { error: error.message, code: 'WORKOUT_PLAN_NOT_ACTIVE_ERROR' }
      }

      if (error instanceof SessionAlreadyStartedError) {
        set.status = 409
        return { error: error.message, code: 'SESSION_ALREADY_STARTED_ERROR' }
      }

      set.status = 500
      return { error: 'Internal server error', code: 'INTERNAL_SERVER_ERROR' }
    })
    .get('/', () => ({
      name: 'Bootcamp Treinos API',
      status: 'ok',
      version: '1.0.0',
    }))
    .get('/health', () => ({ status: 'healthy' }))
    .get('/me', async ({ headers }) => {
      const userId = requireUserId(headers)

      return getUserTrainData({ userId })
    })
    .put('/me', async ({ body, headers }) => {
      const userId = requireUserId(headers)
      const parsedBody = parseSchema(UpsertUserTrainDataBodySchema, body)

      return upsertUserTrainData({ userId, body: parsedBody })
    })
    .get('/workout-plans', async ({ headers, query }) => {
      const userId = requireUserId(headers)
      const parsedQuery = parseSchema(ListWorkoutPlansQuerySchema, query)

      return listWorkoutPlans({ userId, query: parsedQuery })
    })
    .post('/workout-plans', async ({ body, headers, set }) => {
      const userId = requireUserId(headers)
      const parsedBody = parseSchema(CreateWorkoutPlanBodySchema, body)
      const result = await createWorkoutPlan({ userId, body: parsedBody })

      set.status = 201
      return result
    })
    .get('/workout-plans/:workoutPlanId', async ({ headers, params }) => {
      const userId = requireUserId(headers)
      const parsedParams = parseSchema(WorkoutPlanParamsSchema, params)

      return getWorkoutPlan({
        userId,
        workoutPlanId: parsedParams.workoutPlanId,
      })
    })
    .post(
      '/workout-plans/:workoutPlanId/days/:workoutDayId/sessions',
      async ({ headers, params, set }) => {
        const userId = requireUserId(headers)
        const parsedParams = parseSchema(WorkoutDayParamsSchema, params)
        const result = await startWorkoutSession({
          userId,
          workoutPlanId: parsedParams.workoutPlanId,
          workoutDayId: parsedParams.workoutDayId,
        })

        set.status = 201
        return result
      },
    )
    .patch(
      '/workout-plans/:workoutPlanId/days/:workoutDayId/sessions/:sessionId',
      async ({ body, headers, params }) => {
        const userId = requireUserId(headers)
        const parsedParams = parseSchema(WorkoutSessionParamsSchema, params)
        const parsedBody = parseSchema(UpdateWorkoutSessionBodySchema, body)

        return updateWorkoutSession({
          userId,
          workoutPlanId: parsedParams.workoutPlanId,
          workoutDayId: parsedParams.workoutDayId,
          sessionId: parsedParams.sessionId,
          completedAt: parsedBody.completedAt,
        })
      },
    )
