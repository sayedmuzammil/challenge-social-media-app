'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar/navbar';
import apiService from '@/services/services';
import { useAuth } from '@/lib/auth';

type ProfileForm = {
  avatarUrl?: string;
  bio?: string;
  name: string;
  username: string;
  phone: string;
  createdAt: string;
  id: number;
};

export default function EditProfilePage() {
  const auth = useAuth();
  const router = useRouter();
  const [name, setName] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [bio, setBio] = React.useState('');

  const [form, setForm] = React.useState<ProfileForm>();

  const [avatarUrl, setAvatarUrl] = React.useState<string>(
    '/images/default-avatar.png'
  );
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const dataStats = await apiService.getUserStats();

        console.log('User profile fetched successfully:', dataStats);

        setForm(dataStats.data.profile ?? []);

        if (dataStats.data.profile) {
          setName(dataStats.data.profile.name);
          setUsername(dataStats.data.profile.username);
          setPhone(dataStats.data.profile.phone);
          setBio(dataStats.data.profile.bio);
          setAvatarUrl(dataStats.data.profile.avatarUrl);
        }
      } catch (err: any) {
        console.error('getUserSavedListService error:', err?.message || err);
      }
    })();
  }, [auth?.user?.username]);

  function onPickFile() {
    fileInputRef.current?.click();
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const url = URL.createObjectURL(file);
    setAvatarUrl(url);
  }

  function onRemovePhoto() {
    setAvatarFile(null);
    setAvatarUrl('/images/default-avatar.png');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  // function set<K extends keyof ProfileForm>(key: K, v: ProfileForm[K]) {
  //   setForm((f) => ({ ...f, [key]: v }));
  // }

  // async function onSubmit(e: React.FormEvent) {
  //   e.preventDefault();
  //   try {
  //     setSubmitting(true);
  //     await apiService.updateProfileService(
  //       name,
  //       username,
  //       phone,
  //       bio,
  //       avatarUrl
  //     );
  //     // ----------------------------------------------------
  //     router.push('/profile'); // or show a toast
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setSubmitting(false);
  //   }
  // }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSubmitting(true);

      const token = localStorage.getItem('token') ?? '';
      console.log('[submit] token length:', token.length);

      const formData = new FormData();
      formData.append('name', name);
      formData.append('username', username);
      formData.append('phone', phone);
      formData.append('bio', bio);
      if (avatarFile) {
        console.log('[submit] sending file:', avatarFile.name, avatarFile.size);
        formData.append('avatar', avatarFile, avatarFile.name);
      } else if (avatarUrl.startsWith('http')) {
        console.log('[submit] sending avatarUrl:', avatarUrl);
        formData.append('avatarUrl', avatarUrl);
      } else {
        console.log('[submit] no avatar/URL to send');
      }

      const res = await fetch('/api/user-update-profile', {
        method: 'PATCH',
        headers: {
          accept: '*/*',
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const raw = await res.text();
      console.log('[submit] internal route status:', res.status);
      console.log('[submit] internal route raw:', raw);

      let json: any = raw;
      try {
        json = JSON.parse(raw);
      } catch {}

      if (!res.ok) {
        throw new Error(
          (json && (json.error?.message || json.error)) ||
            `Update failed with ${res.status}`
        );
      }

      router.push('/profile');
    } catch (err) {
      console.error('[submit] error:', err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="bg-background">
      <Navbar />
      <div className="mx-auto mt-10 w-200">
        <header className="mb-5">
          <h1 className="text-xl font-semibold text-foreground">
            Edit Profile
          </h1>
        </header>

        <section className="rounded-2xl border border-border bg-background/60 p-6 shadow-2xl">
          <form onSubmit={onSubmit} className="grid gap-8 grid-cols-[1fr_2fr] ">
            {/* Left: Avatar */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative size-28">
                {/* For blob preview we keep it simple with a regular <img> */}
                <Image
                  src={avatarUrl || '/images/default-avatar.png'}
                  width={280}
                  height={280}
                  alt="Profile photo"
                  className="h-28 w-28 rounded-full object-cover ring-1 ring-white/10"
                />
              </div>

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={onPickFile}
                  className="rounded-full border border-white/10 bg-zinc-900 px-4 py-2 text-sm text-zinc-200 hover:border-zinc-400/20 hover:bg-zinc-800"
                >
                  Change Photo
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="sr-only"
              />
            </div>

            {/* Right: Fields */}
            <div className="grid gap-5">
              {/* Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-xs text-zinc-300">
                  Name
                </label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-violet-500"
                  placeholder="Your name"
                  required
                />
              </div>

              {/* Username */}
              <div className="space-y-2">
                <label htmlFor="username" className="text-xs text-zinc-300">
                  Username
                </label>
                <input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-violet-500"
                  placeholder="username"
                  required
                />
              </div>

              {/* Number Phone (kept to match your screenshot text) */}
              <div className="space-y-2">
                <label htmlFor="phone" className="text-xs text-zinc-300">
                  Number Phone
                </label>
                <input
                  id="phone"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => {
                    const onlyDigits = e.target.value.replace(/[^\d+]/g, '');
                    setPhone(onlyDigits);
                  }}
                  className="w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-violet-500"
                  placeholder="08xxxxxxxxxx"
                  required
                />
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <label htmlFor="bio" className="text-xs text-zinc-300">
                  Bio
                </label>
                <textarea
                  id="bio"
                  rows={4}
                  value={bio || ''}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full resize-none rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-violet-500"
                  placeholder="Tell something about you…"
                  required
                />
              </div>

              {/* Save */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:brightness-110 disabled:opacity-60"
                >
                  {submitting ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
