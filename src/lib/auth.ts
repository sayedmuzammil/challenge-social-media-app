'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from '@/services/services';

type LoginUser = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  avatarUrl: string;
};
type AuthData = { token: string; user: LoginUser };

// Your API returns: { success, message, data: { token, user } }
type LoginResponse = {
  success: boolean;
  message: string;
  data: AuthData;
};

export function useLogin() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const res: LoginResponse = await apiService.loginService(email, password);
      if (!res?.success) throw new Error(res?.message ?? 'Login failed');
      return res.data; // { token, user }
    },
    onSuccess: (auth) => {
      // 1) Save to TanStack Query cache
      qc.setQueryData<AuthData>(['auth'], auth);
      // 2) Mirror to localStorage so it survives refresh
      localStorage.setItem('token', auth.token);
      localStorage.setItem('user', JSON.stringify(auth.user));
    },
  });
}

// Anywhere in the app, read cached auth quickly:
export function useAuth() {
  const qc = useQueryClient();
  return qc.getQueryData<AuthData>(['auth']); // → { token, user } | undefined
}

// Optional logout helper:
export function useLogout() {
  const qc = useQueryClient();
  return () => {
    qc.removeQueries({ queryKey: ['auth'], exact: true });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };
}
