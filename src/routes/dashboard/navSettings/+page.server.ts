// src/routes/[your‐folder]/+page.server.ts
import { redirect, fail } from '@sveltejs/kit';

export interface AdminFromAPI {
  id: string;         // mapped from _id
  name: string;       // combined firstName + ' ' + surname
  firstName: string;
  surname: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  lastLogin: string;
  avatarUrl: string;
}

// Tell SvelteKit that load() returns { admins: AdminFromAPI[] }
export interface PageData {
  admins: AdminFromAPI[];
}

export const load = async ({ cookies, fetch }): Promise<PageData> => {
  const token = cookies.get('admin_token');
  if (!token) {
    throw redirect(303, '/login');
  }

  try {
    const res = await fetch('https://api-freedom.com/api/v2/admins/all', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      console.error('Failed to fetch admins:', await res.text());
      return { admins: [] };
    }

    const json = await res.json();
    // The raw array is in json.data
    const adminsRaw: any[] = json.data || [];

    // Map each: _id → id, combine firstName+surname → name, and add avatarUrl
    const mappedAdmins: AdminFromAPI[] = adminsRaw.map((admin) => ({
      id: admin._id, // _id from API
      firstName: admin.firstName,
      surname: admin.surname,
      name: `${admin.firstName} ${admin.surname}`,
      email: admin.email,
      role: admin.role,
      status: admin.status,
      createdAt: admin.createdAt,
      lastLogin: admin.lastLogin,
      avatarUrl: `https://i.pravatar.cc/150?u=${encodeURIComponent(admin.email)}`
    }));

  
    return { admins: mappedAdmins };
  } catch (error) {
    console.error('Error fetching admins:', error);
    return { admins: [] };
  }
};

export const actions = {
  default: async ({ request, cookies, fetch }) => {
    const form = await request.formData();
    const firstName = form.get('firstName');
    const surname = form.get('surName');
    const email = form.get('email');
    const password = form.get('password');
    const role = form.get('role');

    if (!firstName || !surname || !email || !password || !role) {
      return fail(400, { error: 'All fields are required' });
    }

    const token = cookies.get('admin_token');
    if (!token) {
      return fail(401, { error: 'Not authenticated' });
    }

    const body = JSON.stringify({ firstName, surname, email, password, role });

    const res = await fetch('https://api-freedom.com/api/v2/admin/auth/register', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body
    });

    const result = await res.json();
    console.log('API response (register):', result);

    if (res.ok) {
      return { success: true, newAdmin: result.data };
    } else {
      return fail(res.status, { error: result.error || 'Failed to create admin' });
    }
  }
};
