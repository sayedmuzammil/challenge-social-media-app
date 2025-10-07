'use client';

import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import React from 'react';

const RegisterPage: React.FC = () => {
  const router = useRouter();

  const [name, setName] = React.useState('');

  const [email, setEmail] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showPwd, setShowPwd] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [isNameError, setIsNameError] = React.useState(false);
  const [isEmailError, setIsEmailError] = React.useState(false);
  const [isUsernameError, setIsUsernameError] = React.useState(false);
  const [isPhoneError, setIsPhoneError] = React.useState(false);
  const [isPasswordError, setIsPasswordError] = React.useState(false);
  const [isConfirmPasswordError, setIsConfirmPasswordError] =
    React.useState(false);

  const [error, setError] = React.useState<string>('');
  const [success, setSuccess] = React.useState<string>('');

  const nameErrorMessage = 'Please enter your name.';
  const emailErrorMessage = 'Please enter a valid email address.';
  const usernameErrorMessage = 'Please enter a username.';
  const phoneErrorMessage = 'Please enter a valid phone number.';
  const passwordErrorMessage = 'Please enter a password.';
  const confirmPasswordErrorMessage = 'Passwords do not match.';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    console.log({ name, email, username, phone, password });

    if (name === '') {
      setIsNameError(true);
    } else {
      setIsNameError(false);
    }

    if (email === '') {
      setIsEmailError(true);
    } else {
      setIsEmailError(false);
    }

    if (username === '') {
      setIsUsernameError(true);
    } else {
      setIsUsernameError(false);
    }

    if (phone === '') {
      setIsPhoneError(true);
    } else {
      setIsPhoneError(false);
    }

    if (password === '') {
      setIsPasswordError(true);
    } else {
      setIsPasswordError(false);
    }

    if (confirmPassword === '') {
      setIsConfirmPasswordError(true);
    } else {
      setIsConfirmPasswordError(false);
    }

    if (!email || !username || !phone || !password || !confirmPassword) {
      setError('Please fill out all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          username,
          phone,
          password,
        }),
      });

      if (res.ok) {
        setSuccess('Account created! You can now log in.');
        setName('');
        setEmail('');
        setUsername('');
        setPhone('');
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => router.push('/login'), 2000);
        return; // prevent falling through
      }

      // not ok
      throw new Error('Registration failed. Please try again.');
    } catch (err: unknown) {
      let message = 'Registration failed. Please try again.';
      if (err instanceof Error) {
        message = err.message;
      } else if (
        typeof err === 'object' &&
        err !== null &&
        'message' in err &&
        typeof (err as { message?: unknown }).message === 'string'
      ) {
        message = (err as { message: string }).message;
      }
      setError(message);
    }
  };

  return (
    <main className="bg-login min-h-dvh grid place-items-center p-6">
      <section className="w-full max-w-xl rounded-2xl border border-white/10 bg-zinc-900/60 p-8 shadow-2xl backdrop-blur flex flex-col gap-6">
        {/* Header */}
        <div className="flex justify-center items-center gap-3">
          <Image src="/icons/logo.svg" alt="Logo" width={42} height={42} />
          <div className="text-foreground text-[1.5rem]">Sociality</div>
        </div>
        <h1 className="text-center text-xl font-semibold">Register</h1>

        {/* Alerts */}
        {error && (
          <p className="text-sm rounded-md border border-red-500/30 bg-red-500/10 p-3 text-red-300">
            {error}
          </p>
        )}
        {success && (
          <p className="text-sm rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3 text-emerald-300">
            {success}
          </p>
        )}

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm text-zinc-300">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              className={`w-full rounded-md border  bg-zinc-900 px-3 py-2 text-sm text-white outline-none ring-0 placeholder:text-zinc-500 focus:border-violet-500 
              ${isNameError ? 'border-red-400' : 'border-white/10'}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {isNameError && (
              <p className="text-sm text-red-400">{nameErrorMessage}</p>
            )}
          </div>
          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm text-zinc-300">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              className={`w-full rounded-md border  bg-zinc-900 px-3 py-2 text-sm text-white outline-none ring-0 placeholder:text-zinc-500 focus:border-violet-500 
                ${isEmailError ? 'border-red-400' : 'border-white/10'}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {isEmailError && (
              <p className="text-sm text-red-400">{emailErrorMessage}</p>
            )}
          </div>

          {/* Username */}
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm text-zinc-300">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter your username"
              className={`w-full rounded-md border  bg-zinc-900 px-3 py-2 text-sm text-white outline-none ring-0 placeholder:text-zinc-500 focus:border-violet-500
                ${isUsernameError ? 'border-red-400' : 'border-white/10'}
               `}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {isUsernameError && (
              <p className="text-sm text-red-400">{usernameErrorMessage}</p>
            )}
          </div>

          {/* Number Phone */}
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm text-zinc-300">
              Number Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Enter your number phone"
              className={`w-full rounded-md border  bg-zinc-900 px-3 py-2 text-sm text-white outline-none ring-0 placeholder:text-zinc-500 focus:border-violet-500
                ${isPhoneError ? 'border-red-400' : 'border-white/10'}
               `}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {isPhoneError && (
              <p className="text-sm text-red-400">{phoneErrorMessage}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm text-zinc-300">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPwd ? 'text' : 'password'}
                placeholder="Enter your password"
                className={`w-full rounded-md border  bg-zinc-900 px-3 py-2 pr-10 text-sm text-white outline-none ring-0 placeholder:text-zinc-500 focus:border-violet-500
                  ${isPasswordError ? 'border-red-400' : 'border-white/10'}
                `}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                aria-label={showPwd ? 'Hide password' : 'Show password'}
                onClick={() => setShowPwd((s) => !s)}
                className="absolute inset-y-0 right-0 grid w-10 place-items-center text-zinc-400 hover:text-zinc-200"
              >
                {showPwd ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {isPasswordError && (
              <p className="text-sm text-red-400">{passwordErrorMessage}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm text-zinc-300">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Enter your confirm password"
                className={`w-full rounded-md border  bg-zinc-900 px-3 py-2 pr-10 text-sm text-white outline-none ring-0 placeholder:text-zinc-500 focus:border-violet-500
                  ${
                    isConfirmPasswordError
                      ? 'border-red-400'
                      : 'border-white/10'
                  }`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                aria-label={
                  showConfirm
                    ? 'Hide confirm password'
                    : 'Show confirm password'
                }
                onClick={() => setShowConfirm((s) => !s)}
                className="absolute inset-y-0 right-0 grid w-10 place-items-center text-zinc-400 hover:text-zinc-200"
              >
                {showConfirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {isConfirmPasswordError && (
              <p className="text-sm text-red-400">
                {confirmPasswordErrorMessage}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-2 w-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 transition-[filter,transform] hover:brightness-110 active:translate-y-px"
          >
            Submit
          </button>
        </form>

        {/* Footer */}
        <p className="mt-2 text-center text-xs text-zinc-400">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Log in
          </Link>
        </p>
      </section>
    </main>
  );
};

export default RegisterPage;
