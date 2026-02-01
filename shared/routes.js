import { z } from 'zod';
import { insertUserSchema, insertPrintJobSchema } from './schema.js';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    register: {
      method: 'POST',
      path: '/api/register',
      input: insertUserSchema,
      responses: {
        201: z.custom(),
        400: errorSchemas.validation,
      },
    },
    login: {
      method: 'POST',
      path: '/api/login',
      input: z.object({ username: z.string(), password: z.string() }),
      responses: {
        200: z.custom(),
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: 'POST',
      path: '/api/logout',
      responses: {
        200: z.object({ message: z.string() }),
      },
    },
    me: {
      method: 'GET',
      path: '/api/user',
      responses: {
        200: z.custom(),
        401: errorSchemas.unauthorized,
      },
    },
  },
  jobs: {
    list: {
      method: 'GET',
      path: '/api/jobs',
      responses: {
        200: z.array(z.custom()),
      },
    },
    create: {
      method: 'POST',
      path: '/api/jobs',
      // Input validation is handled manually for multipart/form-data
      responses: {
        201: z.custom(),
        400: errorSchemas.validation,
      },
    },
    updateStatus: {
      method: 'PATCH',
      path: '/api/jobs/:id/status',
      input: z.object({ status: z.enum(["pending", "printing", "ready", "completed"]) }),
      responses: {
        200: z.custom(),
        404: errorSchemas.notFound,
      },
    },
    get: {
      method: 'GET',
      path: '/api/jobs/:id',
      responses: {
        200: z.custom(),
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path, params) {
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
