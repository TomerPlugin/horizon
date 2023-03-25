import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import useAuth, { AuthProvider } from '../hooks/useAuth'
import { auth } from '@/firebase'
import Login from '@/components/Login';
import Loading from '@/components/Loading'

export default function App({ Component, pageProps }: AppProps) {
  const {user, loading} = useAuth();

  if(loading) return <Loading />

  return (
    // HOC
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}
