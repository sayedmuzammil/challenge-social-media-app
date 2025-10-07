// src/app/api/user-update-profile/route.ts
import { NextRequest, NextResponse } from 'next/server';

const BASE = process.env.NEXT_PUBLIC_BASE_API_URL ?? '';

export async function PATCH(request: NextRequest) {
  try {
    const auth = request.headers.get('authorization') ?? '';
    console.log('[PATCH] auth present?', Boolean(auth));
    console.log('[PATCH] BASE:', BASE);

    if (!auth) {
      return NextResponse.json(
        { error: 'Missing Authorization header' },
        { status: 401 }
      );
    }
    if (!BASE) {
      return NextResponse.json(
        { error: 'Missing NEXT_PUBLIC_BASE_API_URL' },
        { status: 500 }
      );
    }

    // Read incoming FormData
    const incoming = await request.formData();
    const debugEntries: Record<string, any> = {};
    for (const [k, v] of incoming.entries()) {
      debugEntries[k] = v instanceof File ? `File(${v.name}, ${v.size}B)` : v;
    }
    console.log('[PATCH] incoming entries:', debugEntries);

    // Build outgoing FormData
    const form = new FormData();
    for (const key of [
      'name',
      'username',
      'phone',
      'bio',
      'avatarUrl',
    ] as const) {
      const v = incoming.get(key);
      if (typeof v === 'string' && v.length) form.append(key, v);
    }
    const avatar = incoming.get('avatar');
    if (avatar instanceof File && avatar.size > 0) {
      form.append('avatar', avatar, avatar.name);
    }

    console.log('[PATCH] forwarding fields:', Array.from(form.keys()));

    // ✅ FIX: Use BASE + '/me' instead of BASE + '/api/me'
    // because BASE already contains the /api path
    const url = `${BASE}/me`;
    console.log('[PATCH] calling URL:', url);

    const upstream = await fetch(url, {
      method: 'PATCH',
      headers: {
        accept: '*/*',
        Authorization: auth,
      },
      body: form,
    });

    const status = upstream.status;
    const text = await upstream.text();
    console.log('[PATCH] upstream status:', status);
    console.log('[PATCH] upstream response:', text);

    let payload: any = text;
    try {
      payload = JSON.parse(text);
    } catch {}

    if (!upstream.ok) {
      console.error('[PATCH] upstream error:', status, payload);
      return NextResponse.json({ error: payload }, { status });
    }

    return NextResponse.json(payload, { status: 200 });
  } catch (e: any) {
    console.error('[PATCH] exception:', e);
    return NextResponse.json(
      { error: e?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
