export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:8080/api';

export const API_TIMEOUT = 30_000;

export const API_ENDPOINTS = {
  sheets: {
    list: '/sheets',
    detail: (id: string | number) => `/sheets/${id}`,
  },
} as const;
