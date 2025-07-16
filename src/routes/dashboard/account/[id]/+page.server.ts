
import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { AccountId } from '$lib/account';

export const load: PageServerLoad<{ account: AccountId }> = async ({
  params,
  cookies,
  fetch
}) => {
  const token = cookies.get('admin_token');
  if (!token) throw redirect(303, '/login');

  const { id } = params;
  const url = `https://api-freedom.com/api/v2/transactions/${id}`;
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
    console.error(`❌ get operations failed (${res.status}):`, body);
    throw error(res.status, `Failed to load user (${res.status})`);
  }

  const payload = await res.json();
  console.log('✅ [server] getTransacationId payload:', payload);

  const raw: any = payload.data ?? payload.account ?? {};

  const account: AccountId = {
    ...raw,
    id: raw._id ?? raw.id
  };

  return { account };
};
