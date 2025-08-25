import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.mock.local',
  headers: {
    'Content-Type': 'application/json',
  },
  // withCredentials: true,
})

export type AuthLoginBody = { type: 'email' | 'mobile'; identifier: string; password: string }
export type AuthLoginResponse = { token: string; user?: { id: string; email?: string; phone?: string } }

export type RegisterPayload = any
export type RegisterResponse = { id: string; message?: string }

api.interceptors.response.use(
  (res) => res,
  (err) => {
    return Promise.reject(err)
  }
)

export const auth = {
  login: (body: AuthLoginBody) => api.post<AuthLoginResponse>('/auth/login', body),
  register: (payload: RegisterPayload) => api.post<RegisterResponse>('/auth/register', payload),
}

export default api
