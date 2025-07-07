// src/routes/dashboard/user/[id]/+page.server.ts
import { redirect, error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { Transaction } from '$lib/transation';

export const load: PageServerLoad<{ transaction: Transaction }> = async ({ params, cookies, fetch }) => {
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
    console.error(`❌ getTransactionById failed (${res.status}):`, body);
    throw error(res.status, `Failed to load transaction (${res.status})`);
  }

  const payload = await res.json();
  const transaction: Transaction = payload;

  return { transaction };
};

export const actions: Actions = {
  updateStatus: async ({ request, cookies, fetch }) => {
    const token = cookies.get('admin_token');
    if (!token) throw redirect(303, '/login');

    const formData = await request.formData();
    const transactionId = formData.get('transactionId')?.toString();
    const status = formData.get('status')?.toString();

    if (!transactionId || !status) {
      return fail(400, { error: 'Missing transactionId or status' });
    }

    const res = await fetch(`https://api-freedom.com/api/v2/transactions/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ transactionId, status })
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error(`❌ updateStatus failed (${res.status}):`, errorData);
      return fail(res.status, { error: errorData.message || 'Failed to update status' });
    }

    return { success: true };
  }
};
