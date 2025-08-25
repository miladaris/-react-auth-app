// src/lib/validation/auth.ts
import * as z from 'zod';

export const emailLoginSchema = z.object({
  email: z.string().min(1, 'ایمیل نباید خالی باشد').email('ایمیل نامعتبر است'),
  password: z.string().min(8, 'رمز عبور باید حداقل ۸ کاراکتر باشد'),
});

export const mobileLoginSchema = z.object({
  country: z.string().min(1, 'کشور انتخاب شود'),
  phone: z.string().regex(/^\d+$/, 'فقط از ارقام استفاده کنید').min(5, 'شماره موبایل نامعتبر است'),
  password: z.string().min(8, 'رمز عبور باید حداقل ۸ کاراکتر باشد'),
});

export const signUpSchema = z.object({
  firstName: z.string().min(1, 'نام را وارد کنید'),
  lastName: z.string().min(1, 'نام خانوادگی را وارد کنید'),
  email: z.string().email('ایمیل نامعتبر است'),
  country: z.string().min(1, 'کشور را انتخاب کنید'),
  phone: z.string().regex(/^\d+$/, 'شماره موبایل فقط باید شامل ارقام باشد').min(5, 'شماره موبایل خیلی کوتاه است'),
  password: z.string().min(8, 'رمز عبور باید حداقل ۸ کاراکتر باشد'),
  risk: z.literal(true, { message: 'باید ریسک را بپذیرید' }),
  tcs: z.literal(true, { message: 'باید قوانین و مقررات را بپذیرید' }),
  marketing: z.boolean().optional(),
});

export type SignUpData = z.infer<typeof signUpSchema>;
