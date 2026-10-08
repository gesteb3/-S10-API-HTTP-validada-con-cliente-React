import type { ApiErrorBody, Medicine, MedicineInput } from './types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as ApiErrorBody;
    const message = Array.isArray(body.message)
      ? body.message.join(' · ')
      : body.message || `Error HTTP ${response.status}`;
    throw new ApiError(message, response.status);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const medicinesApi = {
  list: () => request<Medicine[]>('/medicines'),
  create: (input: MedicineInput) =>
    request<Medicine>('/medicines', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  update: (id: string, input: Partial<MedicineInput>) =>
    request<Medicine>(`/medicines/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    }),
  remove: (id: string) => request<void>(`/medicines/${id}`, { method: 'DELETE' }),
};

