
import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, fetch }) => {
  const token = cookies.get('admin_token');
  if (!token) {
    console.log('❌ No admin token found, redirecting to login');
    throw redirect(303, '/login');
  }

  const ticketsRes = await fetch('https://api-freedom.com/api/v2/support-tickets/admin/tickets', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  console.log('ℹ️ [server] API Response Status:', ticketsRes.status, ticketsRes.statusText);
  console.log('ℹ️ [server] API Response Headers:', Object.fromEntries(ticketsRes.headers));

  if (!ticketsRes.ok) {
    const errorText = await ticketsRes.text();
    console.error('❌ [server] API Error:', {
      status: ticketsRes.status,
      statusText: ticketsRes.statusText,
      body: errorText
    });
    throw error(ticketsRes.status, `Failed to load users: ${ticketsRes.statusText} (${ticketsRes.status}) - ${errorText}`);
  }

  let payload;
  try {
    payload = await ticketsRes.json();
  } catch (err) {
    console.error('❌ [server] JSON Parse Error:', err);
    throw error(500, 'Failed to parse API response');
  }

  const support: any[] = payload.data ?? [];

  if (support.length === 0) {
    console.warn('⚠️ [server] No users found in payload.data');
  }

  const statsRes = await fetch('https://api-freedom.com/api/v2/support-tickets/stats', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!statsRes.ok) {
    const errorText = await statsRes.text();
    console.error('❌ [server] Stats API Error:', {
      status: statsRes.status,
      statusText: statsRes.statusText,
      body: errorText
    });
    throw error(statsRes.status, `Failed to load stats: ${statsRes.statusText} (${statsRes.status}) - ${errorText}`);
  }

  let stats;
  try {
    stats = await statsRes.json();
  } catch (err) {
    console.error('❌ [server] Stats JSON Parse Error:', err);
    throw error(500, 'Failed to parse stats response');
  }


  return {
    support,
    stats
  };
};