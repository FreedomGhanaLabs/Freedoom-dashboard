import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({url}) => {
   
	const token = url.searchParams.get('token');

	console.log(token);
   return 
};


export const actions: Actions = {
	default: async ({ request, url }) => {
		const token = url.searchParams.get('token');
		console.log(token);
		const form = await request.formData();
		const password = form.get('password');
		const confirmPassword = form.get('confirmPassword');

		// website.com/reset?token=a****tokenexample
		// for now we can use http://localhost:5173/reset?token=a****tokenexample
		// later we can use the company domain

		if (typeof token !== 'string' || typeof password !== 'string' || password !== confirmPassword) {
			return fail(400, { error: 'Tokens invalid or passwords do not match.' });
		}

		const res = await fetch('https://api-freedom.com/api/v2/admin/auth/reset-password', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ token, password })
		});

		if (!res.ok) {
			const body = await res.json().catch(() => ({}));
			return fail(res.status, { error: body.error || `Reset failed (${res.status})` });
		}

		const result = await res.json();
		if (!result.success)
			return fail(400, {
				error: result.error || 'Invalid credentials',
				error_email: ' ',
				error_password: ' '
			});

		console.log(result);
		// success! send them to login
		if (result.success) {
			throw redirect(308, '/');
		}
	}
};
