
import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { User } from '$lib/userStore';

export const load: PageServerLoad<{ user: User }> = async ({
  params,
  cookies,
  fetch
}) => {
  const token = cookies.get('admin_token');
  if (!token) throw redirect(303, '/login');

  const { id } = params;
  const url = `https://api-freedom.com/api/v2/user/getUserById/${id}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  if (res.status === 404) {
    throw redirect(302, '/dashboard/user');
  }
  if (!res.ok) {
    const body = await res.text();
    console.error(`❌ getUserById failed (${res.status}):`, body);
    throw error(res.status, `Failed to load user (${res.status})`);
  }

  const payload = await res.json();

  const raw: any = payload.data ?? payload.user ?? {};
  const user: User = {
    ...raw,
    id: raw._id ?? raw.id
  };

  return { user };
};
