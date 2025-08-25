// src/App.tsx
import React from 'react'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'

function getRouteFromHash() {
  const raw = typeof window !== 'undefined' ? window.location.hash : ''
  // normalize: '#/signup' or '#/signin' or ''
  return raw.replace('#', '') || '/signin'
}

export default function App() {
  const [route, setRoute] = React.useState<string>(getRouteFromHash())

  React.useEffect(() => {
    const onHashChange = () => {
      setRoute(getRouteFromHash())
    }
    // listen for hash changes
    window.addEventListener('hashchange', onHashChange)
    // also catch programmatic navigation that might set hash without triggering (very rare)
    // but this is enough in almost all cases
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  if (route.startsWith('/signup')) return <SignUpPage />
  return <SignInPage />
}
