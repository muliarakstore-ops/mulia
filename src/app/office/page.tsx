'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../utils/supabase';

export default function OfficeLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Check if session already exists
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const email = session.user.email || '';
        if (email.toLowerCase() === 'iqbal@muliarak.store') {
          router.push('/office/business');
        } else {
          router.push('/office/dashboard');
        }
      }
    };
    checkSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        // Set secure cookie for 2 days (172800 seconds)
        const token = data.session.access_token;
        const maxAge = 2 * 24 * 60 * 60; // 2 days in seconds
        document.cookie = `mrs_session_token=${token}; path=/; max-age=${maxAge}; SameSite=Lax; Secure`;
        document.cookie = `mrs_session_user=${data.session.user.email}; path=/; max-age=${maxAge}; SameSite=Lax; Secure`;

        const userEmail = data.session.user.email || '';
        if (userEmail.toLowerCase() === 'iqbal@muliarak.store') {
          router.push('/office/business');
        } else {
          router.push('/office/dashboard');
        }
      }
    } catch (err) {
      console.error(err);
      const errMsg = err instanceof Error ? err.message : 'Gagal login. Periksa kembali email dan password.';
      setErrorMsg(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-xl border border-slate-200/60 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-primary-blue/10 text-primary-blue items-center justify-center font-bold text-xl">
            M
          </div>
          <h2 className="text-2xl font-black text-slate-950">Mulia Office</h2>
          <p className="text-xs text-slate-500">Masuk untuk mengelola Dashboard Toko</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="admin@muliarakstore.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-primary-blue/60"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pl-3.5 pr-10 py-2.5 text-xs focus:outline-none focus:border-primary-blue/60"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-650 cursor-pointer text-xs"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {errorMsg && (
            <p className="text-xs text-red-500 font-semibold bg-red-50 p-2.5 rounded-lg border border-red-100">
              ⚠️ {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md ${
              loading
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-primary-blue hover:bg-primary-blue-hover shadow-primary-blue/15 cursor-pointer'
            }`}
          >
            {loading ? '⏳ Menyinkronkan...' : '🔑 Masuk'}
          </button>
        </form>

        <div className="text-center pt-2">
          <a href="/" className="text-xs text-slate-400 hover:text-slate-600 font-semibold transition-colors">
            ← Kembali ke Website Utama
          </a>
        </div>
      </div>
    </div>
  );
}
