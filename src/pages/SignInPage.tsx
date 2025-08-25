import React, { useEffect, useMemo, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import { zodToErrorMap } from '../utils/zodToErrorMap'
import { emailLoginSchema, mobileLoginSchema } from '../lib/validation/auth'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { auth } from '../services/api'
import ReactSelect from 'react-select'
import ReactCountryFlag from 'react-country-flag'
import { FaExclamationCircle } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { mapServerErrorsToRHF } from '../services/errors'

type Mode = 'email' | 'mobile'

const countries = [
  { value: 'US', label: 'United States (+1)', dialCode: '+1', placeholder: '201-555-0123' },
  { value: 'IR', label: 'Iran (+98)', dialCode: '+98', placeholder: '0912xxxxxxx' },
  { value: 'GB', label: 'United Kingdom (+44)', dialCode: '+44', placeholder: '07123 456789' },
  { value: 'AE', label: 'United Arab Emirates (+971)', dialCode: '+971', placeholder: '050xxxxxxx' },
]

export default function SignInPage() {
  const [mode, setMode] = useState<Mode>('email')
  const [loading, setLoading] = useState(false)
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, setError, control, formState, reset, watch } = useForm({
    defaultValues: { email: '', country: countries[0].value, phone: '', password: '' },
    mode: 'onSubmit',
  })

  useEffect(() => {
    reset({ email: '', country: countries[0].value, phone: '', password: '' })
    setGlobalError(null)
  }, [mode, reset])

  const watchedCountry = watch('country');
  const selectedCountry = countries.find((c) => c.value === watchedCountry) || countries[0];
  const phonePlaceholder = selectedCountry.placeholder;

  const onSubmit = async (values: any) => {
    setGlobalError(null)

    // validate based on mode
    if (mode === 'email') {
      const r = emailLoginSchema.safeParse({ email: values.email, password: values.password })
      if (!r.success) {
        const map = zodToErrorMap(r.error)
        for (const k of Object.keys(map)) setError(k as any, { type: 'manual', message: map[k] })
        toast.error('ورود ناموفق بود! اطلاعات وارد شده صحیح نیست.')
        return
      }
    } else {
      const r = mobileLoginSchema.safeParse({ country: values.country, phone: values.phone, password: values.password })
      if (!r.success) {
        const map = zodToErrorMap(r.error)
        for (const k of Object.keys(map)) setError(k as any, { type: 'manual', message: map[k] })
        toast.error('ورود ناموفق بود! اطلاعات وارد شده صحیح نیست.')
        return
      }
    }

    setLoading(true)
    try {
      let identifier = ''
      if (mode === 'email') {
        identifier = values.email
      } else {
        const country = countries.find((c) => c.value === values.country)
        const dial = country ? country.dialCode : ''
        identifier = `${dial}${values.phone}`
      }

      const res = await auth.login({ type: mode, identifier, password: values.password })
      console.log('login success', res.data)
      reset()
      toast.success('ورود با موفقیت انجام شد! خوش آمدید.')
    } catch (err: any) {
      // map known server-side field errors to RHF
      const mapped = mapServerErrorsToRHF(err)
      if (Object.keys(mapped).length > 0) {
        for (const k of Object.keys(mapped)) {
          if (k === '_global') {
            setGlobalError(mapped[k])
            toast.error(mapped[k] || 'ورود ناموفق بود!')
          } else {
            setError(k as any, { type: 'server', message: mapped[k] })
          }
        }
      } else {
        const msg = err?.response?.data?.message || 'ورود ناموفق بود!'
        setGlobalError(msg)
        toast.error(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">Sign In</h2>

        <div role="tablist" aria-label="Sign-in method" className="flex gap-2 mb-5 justify-center">
          {(['email', 'mobile'] as Mode[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setMode(tab)}
              role="tab"
              aria-selected={mode === tab}
              aria-controls={`panel-${tab}`}
              className={`px-4 py-2 rounded-t-md transition ${mode === tab ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
            >
              {tab === 'email' ? 'Email' : 'Mobile'}
            </button>
          ))}
        </div>

        {globalError && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded mb-4 text-sm">
            <FaExclamationCircle className="mt-0.5" />
            <div>{globalError}</div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" aria-live="polite">
          <AnimatePresence mode="wait">
            {mode === 'email' ? (
              <motion.div
                key="email"
                id="panel-email"
                role="tabpanel"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.18 }}
              >
                <Input
                  label="Email"
                  placeholder="you@example.com"
                  {...register('email')}
                  error={formState.errors.email?.message as any}
                  autoComplete="email"
                  disabled={loading}
                />
              </motion.div>
            ) : (
              <motion.div
                key="mobile"
                id="panel-mobile"
                role="tabpanel"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.18 }}
              >
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-4">
                    <label className="block text-sm text-gray-700 mb-1">Country</label>
                    <Controller
                      control={control}
                      name="country"
                      render={({ field }) => (
                        <ReactSelect
                          isDisabled={loading}
                          options={countries}
                          value={countries.find((c) => c.value === field.value) || countries[0]}
                          onChange={(opt: any) => field.onChange(opt.value)}
                          formatOptionLabel={(opt: any) => (
                            <div className="flex items-center gap-2">
                              <ReactCountryFlag svg countryCode={opt.value} style={{ width: '1.2em', height: '1.2em' }} />
                              <span className="text-sm">{opt.dialCode}</span>
                            </div>
                          )}
                          isSearchable={false}
                          styles={{
                            control: (base) => ({ ...base, minHeight: '44px' }),
                          }}
                        />
                      )}
                    />
                  </div>

                  <div className="col-span-8">
                    <Input
                      label="Mobile"
                      placeholder={phonePlaceholder}
                      {...register('phone')}
                      error={formState.errors.phone?.message as any}
                      inputMode="numeric"
                      disabled={loading}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Your password"
            {...register('password')}
            error={formState.errors.password?.message as any}
            autoComplete="current-password"
            disabled={loading}
            rightElement={
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
                className="px-2 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            }
          />

          <div className="flex justify-between items-center text-sm">
            <a href="#/forgot-password" className="text-blue-600 hover:underline">Forgot Password?</a>
          </div>

          <Button type="submit" loading={loading} className="w-full">Sign In</Button>

          <p className="text-sm text-center">
            Don't have an account yet? <a href="#/signup" className="text-blue-600 hover:underline">Sign Up</a>
          </p>
        </form>
      </div>

    </main>
  )
}
