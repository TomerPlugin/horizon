import React from 'react'
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    User,
    updateProfile,
    fetchSignInMethodsForEmail 
  } from 'firebase/auth'

import { signInWithPopup } from "firebase/auth";

import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { auth, db, provider } from '../firebase'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

interface IAuth {
  user: User | null
  googleSignIn: (username: string | null) => Promise<void>
  signUp: (username: string, email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  error: string | null
  loading: boolean
}

const AuthContext = createContext<IAuth>({
    user: null,
    googleSignIn: async () => {},
    signUp: async () => {},
    signIn: async () => {},
    logout: async () => {},
    error: null,
    loading: false,
})

interface AuthProviderProps {
    children: React.ReactNode
}

export const AuthProvider = ({children}:AuthProviderProps) => {
    const [loading, setLoading ] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const [error, setError] = useState(null)
    const [initialLoading, setInitioalLoading] = useState(true)
    const router = useRouter()

    useEffect(
        () => 
            onAuthStateChanged(auth, (user) => {
                if(user) {
                    // Logged In...
                    setUser(user)
                    // router.push('/')
                } else {
                    // Not logged in...
                    setUser(null)
                }

                setInitioalLoading(false)
            }), [auth]
    )

    // Signing in with Google popup
    const googleSignIn = async(username: string | null) => {
        setLoading(true)

        signInWithPopup(auth, provider).then(async (userCredential) => {
            // updateProfile(userCredential.user, { displayName: username})

            await setDoc(doc(db, "users", userCredential.user.uid), {
                uid: userCredential.user.uid,
                displayName: userCredential.user.displayName,
                email: userCredential.user.email,
                lastSeen: serverTimestamp(),
                photoURL: userCredential.user.photoURL
            }, { merge: true })

            await setDoc(doc(db, "userChats", userCredential.user.uid), {}, {merge:true})

            setUser(userCredential.user)
        }).catch((error) => alert(error.message))
        .finally(() => { setLoading(false) })
    }

    const signUp = async (username: string, email: string, password: string) => {
        setLoading(true)

        await createUserWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
            updateProfile(userCredential.user, { displayName: username})
            
            setUser(userCredential.user)

        }).catch((error) => {
            switch (error.code) {
                case 'auth/email-already-in-use':
                  console.log(`Email address ${email} already in use.`);
                  break;
                case 'auth/invalid-email':
                  console.log(`Email address ${email} is invalid.`);
                  break;
                case 'auth/operation-not-allowed':
                  console.log(`Error during sign up.`);
                  break;
                case 'auth/weak-password':
                  console.log('Password is not strong enough. Add additional characters including special characters and numbers.');
                  break;
                default:
                  console.log(error.message);
                  break;
              }
        })
        .finally(() => { setLoading(false) })
    }

    const signIn = async (email: string, password: string) => {
        setLoading(true)

        await signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
            setUser(userCredential.user)
        }).catch((error) => alert(error.message))
        .finally(() => { setLoading(false) })
    }

    const logout = async () => {
        setLoading(true)

        signOut(auth).then(() => {setUser(null)})
        .catch((error) => alert(error.message))
        .finally(() => { setLoading(false) })
    }

    const memoedValue = useMemo(() => ({
        user, googleSignIn, signUp, signIn, logout, loading, error
    }), [user, loading, error])

    return (
    <AuthContext.Provider value={memoedValue}>
        {!initialLoading && children}
    </AuthContext.Provider>
    )
}    

export default function useAuth() {
    return useContext(AuthContext)
}