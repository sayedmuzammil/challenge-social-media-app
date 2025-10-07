const loginService = async (email: string, password: string) => {
  const response = await fetch(`/api/login`, {
    method: 'POST',
    headers: { accept: '*/*', 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email, password: password }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err?.error || 'Failed login');
  }

  const data = await response.json();

  return data;
};

const registerService = async (
  name: string,
  username: string,
  email: string,
  phone: string,
  password: string
) => {
  const response = await fetch(`/api/register`, {
    method: 'POST',
    headers: { accept: '*/*', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: username,
      username: username,
      email: email,
      phone: phone,
      password: password,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err?.error || 'Failed Register');
  }

  const data = await response.json();

  return data;
};

const getFeedService = async (page = 1, limit = 20) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`/api/feed?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token ?? ''}`,
    },
  });

  if (!res.ok) {
    let msg = 'Failed Feed';
    try {
      const err = await res.json();
      msg = err?.error || err?.message || msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
};

const getUserStats = async () => {
  const token = localStorage.getItem('token');
  const res = await fetch(`/api/user-stats`, {
    method: 'GET',
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token ?? ''}`,
    },
  });

  if (!res.ok) {
    let msg = 'Failed to get user stats list';
    try {
      const err = await res.json();
      msg = err?.error || err?.message || msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
};

const getUserPostsListService = async (
  username: string,
  page: number,
  limit: number
) => {
  const token = localStorage.getItem('token');
  const res = await fetch(
    `/api/user-post?username=${username}&page=${page}&limit=${limit}`,
    {
      method: 'GET',
      headers: {
        accept: '*/*',
        Authorization: `Bearer ${token ?? ''}`,
      },
    }
  );
  // console.log('res : ', res);

  if (!res.ok) {
    let msg = 'Failed to get user post list';
    try {
      const err = await res.json();
      msg = err?.error || err?.message || msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
};

const getUserSavedListService = async (page: number, limit: number) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`/api/user-saved?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token ?? ''}`,
    },
  });
  // console.log('res : ', res);

  if (!res.ok) {
    let msg = 'Failed to get user post list';
    try {
      const err = await res.json();
      msg = err?.error || err?.message || msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
};

const updateProfileService = async (
  name: string,
  username: string,
  phone: string,
  bio: string,
  avatar?: File | null,
  avatarUrl?: string
) => {
  const token = localStorage.getItem('token');

  // Create FormData
  const formData = new FormData();
  formData.append('name', name);
  formData.append('username', username);
  formData.append('phone', phone);
  formData.append('bio', bio);

  if (avatar instanceof File) {
    formData.append('avatar', avatar);
  }

  if (avatarUrl) {
    formData.append('avatarUrl', avatarUrl);
  }

  const res = await fetch(`/api/user-update-profile`, {
    method: 'PATCH',
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token ?? ''}`,
    },
    body: formData,
  });

  if (!res.ok) {
    let msg = 'Failed to update profile';
    try {
      const err = await res.json();
      msg = err?.error || err?.message || msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
};

export const likePostByIdService = async (postId: number | string) => {
  const token = localStorage.getItem('token');

  const res = await fetch(`/api/like-post-by-id/${postId}`, {
    method: 'POST',
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token ?? ''}`,
    },
  });

  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {}

  if (!res.ok) {
    const message =
      (data && (data.error || data.message)) ||
      text?.slice(0, 300) ||
      `HTTP ${res.status}`;
    throw new Error(message);
  }

  return data;
};

export const deleteLikePostByIdService = async (postId: number | string) => {
  const token = localStorage.getItem('token');

  const res = await fetch(`/api/delete-like-post-by-id/${postId}`, {
    method: 'POST',
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token ?? ''}`,
    },
  });

  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {}

  if (!res.ok) {
    const message =
      (data && (data.error || data.message)) ||
      text?.slice(0, 300) ||
      `HTTP ${res.status}`;
    throw new Error(message);
  }

  return data;
};

const savePostByIdService = async (postId: number | string) => {
  const token = localStorage.getItem('token');

  const res = await fetch(`/api/save-post-by-id/${postId}`, {
    method: 'POST',
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token ?? ''}`,
    },
  });

  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {}

  if (!res.ok) {
    const message =
      (data && (data.error || data.message)) ||
      text?.slice(0, 300) ||
      `HTTP ${res.status}`;
    throw new Error(message);
  }

  return data;
};

const deleteSavePostByIdService = async (postId: number | string) => {
  const token = localStorage.getItem('token');

  const res = await fetch(`/api/delete-save-post-by-id/${postId}`, {
    method: 'POST',
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token ?? ''}`,
    },
  });

  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {}

  if (!res.ok) {
    const message =
      (data && (data.error || data.message)) ||
      text?.slice(0, 300) ||
      `HTTP ${res.status}`;
    throw new Error(message);
  }

  return data;
};

export const getCommentListByID = async (
  postId: number | string,
  page = 1,
  limit = 20
) => {
  const token = localStorage.getItem('token');

  const res = await fetch(
    `/api/comments/get-comment-by-id/${postId}?page=${page}&limit=${limit}`,
    {
      method: 'GET',
      headers: {
        accept: '*/*',
        // Authorization: `Bearer ${token ?? ''}`,
      },
    }
  );

  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {}

  if (!res.ok) {
    const message =
      (data && (data.error || data.message)) ||
      text?.slice(0, 300) ||
      `HTTP ${res.status}`;
    throw new Error(message);
  }

  return data;
};

export const postCommentService = async (
  postId: string | number,
  text: string
) => {
  const token = localStorage.getItem('token') ?? '';

  const res = await fetch(`/api/comments/post-comment/${postId}`, {
    method: 'POST',
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text }),
  });

  const raw = await res.text();
  const data = raw ? JSON.parse(raw) : null;

  if (!res.ok) {
    const msg =
      data?.error ||
      data?.message ||
      raw?.slice(0, 300) ||
      `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data;
};

const apiService = {
  loginService,
  registerService,
  getFeedService,
  getUserStats,
  getUserPostsListService,
  getUserSavedListService,
  updateProfileService,
  likePostByIdService,
  deleteLikePostByIdService,
  savePostByIdService,
  deleteSavePostByIdService,
  getCommentListByID,
  postCommentService,
};

export default apiService;
