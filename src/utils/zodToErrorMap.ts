import { ZodError } from 'zod'
export function zodToErrorMap(err: ZodError<any>) {
  const out: Record<string, string> = {}
  for (const e of err.issues) {
    // اگر path آرایه‌ای است، join کن (مثلاً برای nested fields)
    const path = e.path.length > 0 ? e.path.join('.') : '_global'
    out[path] = e.message
  }
  return out
}
