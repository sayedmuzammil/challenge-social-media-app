'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation'; // ⬅️ use App Router hook
import { useLogin } from '@/lib/auth';

const LoginPage = () => {
  const router = useRouter();
  const { mutateAsync: login, isPending, isError, error } = useLogin();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [show, setShow] = useState(false);
  const [isEmailError, setIsEmailError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [failedLogin, setFailedLogin] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (email === '') {
      setIsEmailError(true);
      console.log('Email is empty');
    } else {
      setIsEmailError(false);
    }

    if (password === '') {
      setIsPasswordError(true);
    } else {
      setIsPasswordError(false);
    }

    if (isError) {
      console.log('Login failed', error);
      setFailedLogin(true);
      return;
    }

    if (isEmailError || isPasswordError) {
      return;
    }

    try {
      await login({ email, password }); // puts API response {token,user} in TanStack + localStorage
      setEmail('');
      setPassword('');
      router.push('/homepage'); // redirect when success
    } catch (error) {
      console.log('Login failed', error);
    }
  };

  return (
    <main className="bg-background flex justify-center items-center h-screen p-6">
      <section className="w-full max-w-md rounded-2xl border border-primary bg-zinc-900/60 p-6 shadow-2xl flex flex-col gap-6">
        <div className="flex justify-center items-center gap-3">
          <Image src={'/icons/logo.svg'} alt="Logo" width={50} height={50} />
          <div className="text-foreground text-[1.5rem]"> Sociality </div>
        </div>
        <h1 className="text-center text-lg font-semibold">
          {failedLogin
            ? 'Oh my, you forget your account? 🤔 '
            : 'Hi, Welcome back!'}
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm text-zinc-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              // required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full rounded-md border  bg-zinc-900 px-3 py-2 pr-10 text-sm text-white outline-none focus:border-violet-500
                ${isEmailError ? 'border-red-400' : 'border-white/10'}
                `}
              placeholder="Enter your email"
            />
            <div>
              {isEmailError && (
                <p className="text-sm text-red-400">
                  I think you forget to enter the email.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm text-zinc-300">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={show ? 'text' : 'password'}
                // required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full rounded-md border  bg-zinc-900 px-3 py-2 pr-10 text-sm text-white outline-none focus:border-violet-500
                ${isPasswordError ? 'border-red-400' : 'border-white/10'}
                `}
                placeholder="Enter your password"
              />
              <button
                type="button"
                aria-label={show ? 'Hide password' : 'Show password'}
                onClick={() => setShow((s) => !s)}
                className="absolute inset-y-0 right-0 grid w-10 place-items-center text-zinc-400 hover:text-zinc-200"
              >
                {show ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <div>
              {isPasswordError && (
                <p className="text-sm text-red-400">
                  I think you forget to enter the password.
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 w-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:brightness-110 disabled:opacity-60"
          >
            <div className="flex justify-center items-center gap-2">
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {isPending ? 'Signing in…' : 'Login'}
            </div>
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-zinc-400">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="font-medium text-primary hover:text-primary/80"
          >
            Sign up
          </Link>
        </p>
      </section>
    </main>
  );
};

export default LoginPage;
