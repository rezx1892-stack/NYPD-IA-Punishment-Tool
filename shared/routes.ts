import { z } from 'zod';
import { insertLogSchema, offenses, logs } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  offenses: {
    list: {
      method: 'GET' as const,
      path: '/api/offenses',
      responses: {
        200: z.array(z.custom<typeof offenses.$inferSelect>()),
      },
    },
  },
  logs: {
    create: {
      method: 'POST' as const,
      path: '/api/logs',
      input: insertLogSchema,
      responses: {
        201: z.custom<typeof logs.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    generate: {
      method: 'POST' as const,
      path: '/api/generate-message',
      input: z.object({
        hrId: z.string(),
        userId: z.string(),
        ticketNumber: z.string(),
        duration: z.string(),
        action: z.enum(["Punishment", "Revoke"]),
        offenseIds: z.array(z.number()),
        notes: z.string().optional(),
        useAi: z.boolean().default(false),
      }),
      responses: {
        200: z.object({ message: z.string() }),
        400: errorSchemas.validation,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type OffenseResponse = z.infer<typeof api.offenses.list.responses[200]>[number];
export type GenerateMessageInput = z.infer<typeof api.logs.generate.input>;
export type GenerateMessageResponse = z.infer<typeof api.logs.generate.responses[200]>;
