import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import ReactSelect from 'react-select'
import ReactCountryFlag from 'react-country-flag'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Checkbox from '../components/ui/Checkbox'
import { auth } from '../services/api'
import { signUpSchema, type SignUpData } from '../lib/validation/auth'
import { FaExclamationCircle } from 'react-icons/fa'
import { mapServerErrorsToRHF } from '../services/errors'

const countries = [
  { value: 'US', label: 'United States (+1)', dialCode: '+1', placeholder: '201-555-0123' },
  { value: 'IR', label: 'Iran (+98)', dialCode: '+98', placeholder: '0912xxxxxxx' },
  { value: 'GB', label: 'United Kingdom (+44)', dialCode: '+44', placeholder: '07123 456789' },
  { value: 'AE', label: 'United Arab Emirates (+971)', dialCode: '+971', placeholder: '050xxxxxxx' },
]

const bannedCountries = ['IR']

export default function SignUpPage() {
  const [loading, setLoading] = useState(false)
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, control, formState, reset, setError, watch } = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      country: countries[0].value,
      phone: '',
      password: '',
      risk: true,
      tcs: true,
      marketing: false,
    },
  })

  const watchedCountry = watch('country');
  const selectedCountry = countries.find((c) => c.value === watchedCountry) || countries[0];
  const phonePlaceholder = selectedCountry.placeholder;

  const onSubmit = async (data: SignUpData) => {
    setGlobalError(null)
    if (bannedCountries.includes(data.country)) {
      setGlobalError('برای برخی کشورها ثبت‌نام مجاز نیست')
      toast.error('برای برخی کشورها ثبت‌نام مجاز نیست')
      return
    }

    setLoading(true)
    try {
      await auth.register(data)
      reset()
      toast.success('ثبت‌نام با موفقیت انجام شد! اکنون می‌توانید وارد شوید.')
      window.location.hash = '#/signin'
    } catch (err: any) {
      const mapped = mapServerErrorsToRHF(err)
      if (Object.keys(mapped).length > 0) {
        for (const k of Object.keys(mapped)) {
          if (k === '_global') {
            setGlobalError(mapped[k])
            toast.error(mapped[k] || 'ثبت‌نام ناموفق بود!')
          } else {
            setError(k as any, { type: 'server', message: mapped[k] })
          }
        }
      } else {
        const msg = err?.response?.data?.message || 'ثبت‌نام ناموفق بود!'
        setGlobalError(msg)
        toast.error(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-lg bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">Create Account</h2>

        {globalError && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded mb-4 text-sm">
            <FaExclamationCircle className="mt-0.5" />
            <div>{globalError}</div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" aria-live="polite">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="First Name" {...register('firstName')} error={formState.errors.firstName?.message as any} disabled={loading} />
            <Input label="Last Name" {...register('lastName')} error={formState.errors.lastName?.message as any} disabled={loading} />
          </div>

          <Input label="Email" {...register('email')} error={formState.errors.email?.message as any} disabled={loading} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
            <div className="col-span-1">
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
                        <span className="text-sm">{opt.label}</span>
                      </div>
                    )}
                    styles={{
                      control: (base) => ({ ...base, minHeight: '44px' }),
                    }}
                  />
                )}
              />
              {formState.errors.country && <p className="mt-1 text-xs text-red-600">{formState.errors.country.message}</p>}
            </div>

            <div className="md:col-span-2">
              <Input label="Phone" placeholder={phonePlaceholder} {...register('phone')} error={formState.errors.phone?.message as any} inputMode="numeric" disabled={loading} />
            </div>
          </div>

          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            {...register('password')}
            error={formState.errors.password?.message as any}
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

          <div className="space-y-2">
            <Checkbox label={<><span>I have read and agree to the <span className="font-semibold">RISK DISCLAIMER</span></span></>} {...register('risk' as any)} disabled={loading} />
            <Checkbox label={<><span>I have read and agree to the <span className="font-semibold">T&Cs</span></span></>} {...register('tcs' as any)} disabled={loading} />
            <Checkbox label="I would like to receive news, analysis, marketing, etc." {...register('marketing' as any)} disabled={loading} />
            {(formState.errors.risk || formState.errors.tcs) && (
              <p className="text-xs text-red-600">
                {formState.errors.risk?.message || formState.errors.tcs?.message}
              </p>
            )}
          </div>

          <Button type="submit" loading={loading} className="w-full">Create Account</Button>

          <p className="text-sm text-center">
            Already have an account? <a href="#/signin" className="text-blue-600 hover:underline">Sign In</a>
          </p>

          <p className="mt-3 text-xs text-gray-600">برای برخی کشورها ثبت‌نام مجاز نیست</p>
        </form>
      </div>

    </main>
  )
}
