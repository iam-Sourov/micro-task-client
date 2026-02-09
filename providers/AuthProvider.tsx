"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

export type UserRole = 'worker' | 'buyer' | 'admin';

export interface AppUser {
  email: string;
  name?: string;
  photo?: string;
  role: UserRole;
  coins?: number;
  _id?: string;
}

interface AuthContextType {
  user: FirebaseUser | null;
  appUser: AppUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, photo: string, role: UserRole) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  setAppUser: (u: AppUser | null) => void;
  refreshAppUser: (emailOverride?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

async function getOrCreateJWT(email: string): Promise<string> {
  const res = await fetch(`${API_URL}/jwt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error('Failed to get token');
  const data = await res.json();
  return data.token;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshAppUser = async (emailOverride?: string) => {
    const emailToUse = emailOverride ?? user?.email ?? null;
    if (!emailToUse) return;
    try {
      const token = await getOrCreateJWT(emailToUse);
      if (typeof window !== 'undefined') localStorage.setItem('access-token', token);
      const res = await fetch(`${API_URL}/users/${encodeURIComponent(emailToUse)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAppUser({
          email: data.email,
          name: data.name ?? data.display_name,
          photo: data.photo ?? data.photo_url,
          role: data.role,
          coins: data.coins,
          _id: data._id,
        });
      } else {
        setAppUser(null);
      }
    } catch {
      setAppUser(null);
    }
  };

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return () => {};
    }
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser?.email) {
        setAppUser(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const token = await getOrCreateJWT(firebaseUser.email);
        if (typeof window !== 'undefined') localStorage.setItem('access-token', token);
        const res = await fetch(`${API_URL}/users/${encodeURIComponent(firebaseUser.email)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setAppUser({
            email: data.email,
            name: data.name ?? data.display_name,
            photo: data.photo ?? data.photo_url,
            role: data.role,
            coins: data.coins,
            _id: data._id,
          });
        } else {
          setAppUser(null);
        }
      } catch {
        setAppUser(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!auth) throw new Error('Auth not configured');
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const token = await getOrCreateJWT(cred.user.email!);
    if (typeof window !== 'undefined') localStorage.setItem('access-token', token);
    await refreshAppUser(cred.user.email!);
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
    photo: string,
    role: UserRole
  ) => {
    if (!auth) throw new Error('Auth not configured');
    await createUserWithEmailAndPassword(auth, email, password);
    const res = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        name,
        photo,
        role,
      }),
    });
    const data = await res.json();
    if (data.insertedId === null && data.message?.includes('already exists')) {
      throw new Error('An account with this email already exists.');
    }
    const token = await getOrCreateJWT(email);
    if (typeof window !== 'undefined') localStorage.setItem('access-token', token);
    const userRes = await fetch(`${API_URL}/users/${encodeURIComponent(email)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (userRes.ok) {
      const userData = await userRes.json();
      setAppUser({
        email: userData.email,
        name: userData.name ?? userData.display_name,
        photo: userData.photo ?? userData.photo_url,
        role: userData.role,
        coins: userData.coins,
        _id: userData._id,
      });
    }
  };

  const signInWithGoogle = async () => {
    if (!auth) throw new Error('Auth not configured');
    const cred = await signInWithPopup(auth, new GoogleAuthProvider());
    const email = cred.user.email!;
    const name = cred.user.displayName || '';
    const photo = cred.user.photoURL || '';
    const res = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        name,
        photo,
        role: 'worker',
      }),
    });
    const data = await res.json();
    if (!data.insertedId && data.message?.includes('already exists')) {
      // existing user, just get token
    }
    const token = await getOrCreateJWT(email);
    if (typeof window !== 'undefined') localStorage.setItem('access-token', token);
    await refreshAppUser(email);
  };

  const signOut = async () => {
    if (auth) await firebaseSignOut(auth);
    if (typeof window !== 'undefined') localStorage.removeItem('access-token');
    setAppUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        appUser,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        setAppUser,
        refreshAppUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
