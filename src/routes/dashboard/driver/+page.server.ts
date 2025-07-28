import { redirect, error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { Driver } from '$lib/rides';

export const load: PageServerLoad = async ({ cookies, fetch, url }) => {
	const token = cookies.get('admin_token');
	if (!token) {
		throw redirect(303, '/');
	}

	const page = Number(url.searchParams.get('page') ?? '1');

	const apiUrl = new URL('https://api-freedom.com/api/v2/driver/drivers');
	
	const driversRes = await fetch(apiUrl.toString(), {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	});

	if (!driversRes.ok) {
		throw error(driversRes.status, `Failed to load users (${driversRes.status})`);
	}

	const payload = await driversRes.json();

	const statsRes = await fetch(
		'https://api-freedom.com/api/v2/driver/document/verification-stats',
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			}
		}
	);

	if (!statsRes.ok) {
		throw error(statsRes.status, `Failed to load verification stats (${statsRes.status})`);
	}

	const statsPayload = await statsRes.json();
	const verificationStats = statsPayload.data ?? {};

	const pendingNameRes = await fetch('https://api-freedom.com/api/v2/driver/pending-name-updates', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	});

	if (!pendingNameRes.ok) {
		throw error(
			pendingNameRes.status,
			`Failed to load pending name updates (${pendingNameRes.status})`
		);
	}

	const pendingNamePayload = await pendingNameRes.json();
	const pendingNameUpdates = pendingNamePayload.data ?? [];

	const pendingDocsRes = await fetch('https://api-freedom.com/api/v2/driver/document/pending-verifications', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	});

	if (!pendingDocsRes.ok) {
		throw error(
			pendingDocsRes.status,
			`Failed to load pending document verifications (${pendingDocsRes.status})`
		);
	}

	const pendingDocsPayload = await pendingDocsRes.json();
	const pendingDocumentVerifications = pendingDocsPayload.data ?? [];


		
	

	return {
		drivers: payload.data ?? [],
		currentPage: payload.page ?? page,
		totalPages: payload.pages ?? 1,		
		verificationStats,
		pendingNameUpdates,
		pendingDocumentVerifications
	};
};

export const actions: Actions = {
	search: async ({ request, cookies, fetch }) => {
		const token = cookies.get('admin_token');
		if (!token) {
			throw redirect(303, '/login');
		}

		const form = await request.formData();
		const identifier = form.get('identifier')?.toString().trim();

		if (!identifier) {
			return fail(400, { error: 'Identifier is required (email or phone number).' });
		}

		const res = await fetch('https://api-freedom.com/api/v2/driver/search', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({ identifier })
			});

		if (!res.ok) {
			return fail(res.status, { error: `Search failed with status ${res.status}` });
		}

		const payload = await res.json();
		const driver: Driver | null = payload.data;

		return {
			success: true,
			driver
		};
	}
};