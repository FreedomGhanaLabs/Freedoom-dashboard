// src/routes/dashboard/user/[id]/+page.server.ts
import { redirect, error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { Application } from '$lib/application';

export const load: PageServerLoad<{ application: Application }> = async ({
	params,
	cookies,
	fetch
}) => {
	const token = cookies.get('admin_token');
	if (!token) throw redirect(303, '/login');

	const { id } = params;
	const url = `https://api-freedom.com/api/v2/riders/admin/applications/${id}`;
	const res = await fetch(url, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	});

	if (res.status === 404) throw redirect(302, '/dashboard/user');
	if (!res.ok) {
		const body = await res.text();
		console.error(`❌ Fetch failed (${res.status}):`, body);
		throw error(res.status, `Failed to load user`);
	}

	const payload = await res.json();
	const raw: any = payload.data ?? {};
	const application: Application = {
		...raw,
		id: raw._id ?? raw.id
	};

	return { application };
};

export const actions: Actions = {
	approve: async ({ params, request, cookies, fetch }) => {
		return await updateStatus('approved', params, request, cookies, fetch);
	},

	reject: async ({ params, request, cookies, fetch }) => {
		return await updateStatus('rejected', params, request, cookies, fetch);
	},

	scheduleInterview: async ({ params, request, cookies, fetch }) => {
		const token = cookies.get('admin_token');
		const { id } = params;

		const formData = await request.formData();
		const interviewDate = formData.get('interviewDate')?.toString();
		const interviewNotes = formData.get('interviewNotes')?.toString();

		if (!interviewDate || !interviewNotes) {
			return fail(400, { message: 'Interview date and notes are required.' });
		}

		const res = await fetch(`https://api-freedom.com/api/v2/riders/admin/applications/${id}/interview`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({
				interviewDate,
				interviewNotes
			})
		});

		if (!res.ok) {
			const errorText = await res.text();
			console.error(`❌ Failed to schedule interview:`, errorText);
			return fail(res.status, { message: 'Failed to schedule interview' });
		}

		return { success: true };
	},

	delete: async ({ params, cookies, fetch }) => {
		const token = cookies.get('admin_token');
		const { id } = params;

		const res = await fetch(`https://api-freedom.com/api/v2/riders/admin/applications/${id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		if (!res.ok) {
			const errorText = await res.text();
			console.error(`❌ Failed to delete application:`, errorText);
			return fail(res.status, { message: 'Failed to delete application' });
		}

		// Redirect after successful delete
		throw redirect(303, '/dashboard/application');
	}
};

async function updateStatus(
	status: string,
	params: any,
	request: Request,
	cookies: any,
	fetch: typeof globalThis.fetch
) {
	const token = cookies.get('admin_token');
	const { id } = params;
	const formData = await request.formData();
	const reviewNotes = formData.get('reviewNotes')?.toString() ?? '';

	const res = await fetch(`https://api-freedom.com/api/v2/riders/admin/applications/${id}/status`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify({ status, reviewNotes })
	});

	if (!res.ok) {
		const errorText = await res.text();
		console.error(`❌ Failed to update application status (${status}):`, errorText);
		return fail(res.status, { message: `Failed to ${status} application` });
	}

	return { success: true };
}
