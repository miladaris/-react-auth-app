// استاندارد: اگر API این شکل برگرداند: { errors: { email: "already used", phone: "invalid" } }
export function mapServerErrorsToRHF(err: any) {
  const out: Record<string, string> = {}
  const data = err?.response?.data
  if (!data) return out

  if (data.errors && typeof data.errors === 'object') {
    for (const k of Object.keys(data.errors)) {
      const val = data.errors[k]
      out[k] = Array.isArray(val) ? val.join(' ') : String(val)
    }
    return out
  }

  // fallback: message
  if (data.message) {
    out._global = String(data.message)
  }
  return out
}
