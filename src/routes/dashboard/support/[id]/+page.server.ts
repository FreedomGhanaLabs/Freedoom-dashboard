import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { SupportTicket, Message } from '$lib/ticketStore';

export const load: PageServerLoad = async ({ params, cookies, fetch }) => {
  const token = cookies.get('admin_token');
  if (!token) throw redirect(303, '/login');

  const { id } = params;
  const url = `https://api-freedom.com/api/v2/support-tickets/admin/tickets/${id}`;
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
    // console.error(`❌ getSupportById failed (${res.status}):`, body);
    throw error(res.status, `Failed to load ticket (${res.status})`);
  }

  const payload = await res.json();
  // console.log('✅ [server] get Support By Id payload:', payload);

  const ticket: SupportTicket = {
    ...payload.data.ticket,
    creator: payload.data.creator,
    assignedAdmin: payload.data.assignedAdmin,
    transactionDetails: payload.data.transactionDetails,
    metrics: payload.data.metrics,
    permissions: payload.data.permissions,
    meta: payload.data.meta
  };

  return { ticket };
};

export const actions: Actions = {
  resolve: async ({ request, params, cookies, fetch }) => {
    const token = cookies.get('admin_token');
    if (!token) {
      throw error(401, 'Unauthorized: No admin token found');
    }

    const { id } = params;
    const formData = await request.formData();
    const resolution = formData.get('resolution')?.toString();

    if (!resolution) {
      throw error(400, 'Resolution message is required');
    }

    const url = `https://api-freedom.com/api/v2/support-tickets/resolve/${id}/resolve`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ resolution })
    });

    if (!res.ok) {
      let body;
      try {
        body = await res.text();
        const jsonBody = JSON.parse(body);
        console.error(`❌ resolveTicket failed (${res.status}):`, jsonBody);
        throw error(res.status, jsonBody.message || `Failed to resolve ticket (${res.status})`);
      } catch (parseError) {
        console.error(`❌ resolveTicket failed to parse response (${res.status}):`, body);
        throw error(res.status, `Invalid response from server: ${body}`);
      }
    }

    let payload;
    try {
      payload = await res.json();
    } catch (parseError) {
      console.error(`❌ resolveTicket failed to parse JSON response:`, await res.text());
      throw error(500, 'Failed to parse server response');
    }

    const newMessage: Message = {
      sender: 'admin',
      senderId: 'current_admin_id', // Replace with actual admin ID from auth context
      message: resolution,
      attachments: [],
      createdAt: new Date().toISOString(),
      readAt: null,
      _id: crypto.randomUUID()
    };

    console.log('✅ [server] updateStatus payload:', payload);

    const updatedTicket: SupportTicket = {
      ...payload.data?.ticket,
      creator: payload.data?.creator,
      assignedAdmin: payload.data?.assignedAdmin,
      transactionDetails: payload.data?.transactionDetails,
      metrics: payload.data?.metrics,
      permissions: payload.data?.permissions,
      meta: payload.data?.meta,
      messages: [...(payload.data?.ticket?.messages || []), newMessage]
    };

    return { success: true, ticket: updatedTicket };
  },

  updateStatus: async ({ params, cookies, fetch }) => {
    const token = cookies.get('admin_token');
    if (!token) {
      throw error(401, 'Unauthorized: No admin token found');
    }

    const { id } = params;
    const ticketResponse = await fetch(`https://api-freedom.com/api/v2/support-tickets/admin/tickets/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    if (!ticketResponse.ok) {
      const body = await ticketResponse.text();
      // console.error(`❌ getTicket failed (${ticketResponse.status}):`, body);
      throw error(ticketResponse.status, `Failed to fetch ticket data (${ticketResponse.status})`);
    }

    let ticketData;
    try {
      ticketData = await ticketResponse.json();
    } catch (parseError) {
      console.error(`❌ getTicket failed to parse JSON response:`, await ticketResponse.text());
      throw error(500, 'Failed to parse ticket data response');
    }

    const currentStatus = ticketData.data.ticket.status;
    const newStatus = currentStatus === 'closed' ? 'assigned' : 'closed';

    const url = `https://api-freedom.com/api/v2/support-tickets/admin/tickets/${id}`;
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status: newStatus })
    });

    if (!res.ok) {
      let body;
      try {
        body = await res.text();
        const jsonBody = JSON.parse(body);
        console.error(`❌ updateStatus failed (${res.status}):`, jsonBody);
        throw error(res.status, jsonBody.message || `Failed to update ticket status (${res.status})`);
      } catch (parseError) {
        console.error(`❌ updateStatus failed to parse response (${res.status}):`, body);
        throw error(res.status, `Invalid response from server: ${body}`);
      }
    }

    let payload;
    try {
      payload = await res.json();
    } catch (parseError) {
      console.error(`❌ updateStatus failed to parse JSON response:`, await res.text());
      throw error(500, 'Failed to parse server response');
    }

  

    const updatedTicket: SupportTicket = {
      ...payload.data?.ticket,
      creator: payload.data?.creator,
      assignedAdmin: payload.data?.assignedAdmin,
      transactionDetails: payload.data?.transactionDetails,
      metrics: payload.data?.metrics,
      permissions: payload.data?.permissions,
      meta: payload.data?.meta
    };

    return { success: true, ticket: updatedTicket };
  }
};