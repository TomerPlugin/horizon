import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import useAuth, { AuthProvider } from '../hooks/useAuth'
import { auth } from '@/firebase'
import Login from '@/components/login/Login';
import Loading from '@/components/Loading'
import { store } from '../store/store'
import { Provider } from 'react-redux'

export default function App({ Component, pageProps }: AppProps) {
  const {user, loading} = useAuth();

  if(loading) return <Loading />

  return (
    // HOC
    <Provider store={store}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
      </Provider>
  )
}
