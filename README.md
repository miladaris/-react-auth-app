
# React Auth App

یک پروژه احراز هویت با React، Vite و Tailwind CSS مطابق با استانداردهای حرفه‌ای و خواسته‌های کارفرما.

## ویژگی‌ها
- **فریم‌ورک:** React.js (Vite)
- **استایل:** Tailwind CSS
- **مدیریت فرم:** React Hook Form
- **اعتبارسنجی:** Zod
- **آیکون‌ها:** react-icons
- **ساختار پروژه:** کامپوننت‌بندی استاندارد و پوشه‌بندی تمیز
- **سرویس API:** متدهای login و register در فایل جداگانه

## صفحات
### 1. صفحه ورود (Sign In)
- دو روش ورود: ایمیل + رمز عبور و موبایل + رمز عبور
- تب برای جابجایی بین Email و Mobile با انیمیشن نرم
- فیلدهای ایمیل/موبایل و رمز عبور
- لینک Forgot Password?
- دکمه Sign In (در حالت loading غیرفعال)
- لینک به Sign Up
- نمایش خطاها زیر فیلد و به صورت toast
- placeholder شماره موبایل با انتخاب کشور تغییر می‌کند

### 2. صفحه ثبت‌نام (Sign Up)
- فیلدهای نام، نام خانوادگی، ایمیل، کشور، شماره موبایل، رمز عبور
- انتخاب کشور با پرچم و نام کشور
- چک‌باکس‌های ریسک، قوانین و گزینه مارکتینگ
- دکمه Create Account (در حالت loading غیرفعال)
- لینک به Sign In
- پیام هشدار برای کشورهای ممنوع
- نمایش خطاها زیر فیلد و به صورت toast
- placeholder شماره موبایل با انتخاب کشور تغییر می‌کند

## الزامات طراحی و UX
- ریسپانسیو کامل برای موبایل و دسکتاپ
- طراحی تمیز و مدرن با spacing مناسب و فونت خوانا
- نمایش خطاها به‌صورت واضح

## نحوه اجرا
1. نصب وابستگی‌ها:
  ```bash
  npm install
  ```
2. اجرای پروژه:
  ```bash
  npm run dev
  ```

## آماده‌سازی برای اتصال به API
- endpointهای login و register در فایل `services/api.ts` تعریف شده‌اند و آماده اتصال به API اصلی هستند.

## توسعه‌دهنده
- [miladaris](https://github.com/miladaris)

## لایسنس
MIT

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
