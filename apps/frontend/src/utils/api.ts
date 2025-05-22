// src/utils/api.ts
export const getApiUrl = (path: string) =>
  `${import.meta.env.VITE_API_BASE}${path}`;
