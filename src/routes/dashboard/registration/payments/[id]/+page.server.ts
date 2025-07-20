// +page.server.ts
import { redirect, error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, cookies, fetch }) => {
    const token = cookies.get('admin_token');
    if (!token) throw redirect(303, '/login');

    const { id } = params;

    const url = `https://api-freedom.com/api/v2/riders-program/payments/drivers/${id}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw error(response.status, 'Failed to fetch delivery details');
    }

    const result = await response.json();
    console.log('Payment details:', result);

    if (!result.success) {
        throw error(404, 'Delivery not found');
    }

    return {
        id,
        ride: result.data,
        summary: result.summary,
        pagination: result.pagination
    };
};


export const actions: Actions = {
    record: async ({ request, fetch, params, cookies }) => {
        const token = cookies.get('admin_token');
        if (!token) throw redirect(303, '/login');

        const { id: driverId } = params;

        // ✅ Only read formData once
        const formData = await request.formData();

        const payload = {
            amount: Number(formData.get('amount')),
            paymentMethod: formData.get('paymentMethod'),
            monthOf: formData.get('monthOf'),
            notes: formData.get('notes'),
            paymentFor: formData.get('paymentFor')
        };

        console.log('Sending payment for driver:', driverId);
        console.log('Payload:', payload);

        const res = await fetch(`https://api-freedom.com/api/v2/riders-program/payments/drivers/${driverId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            let msg = 'Payment failed';

            const raw = await res.text(); // ✅ Only read body ONCE
            try {
                const err = JSON.parse(raw); // Try parse
                msg = err.message || msg;
            } catch {
                msg = raw; // Fallback to raw string
            }

            console.error(msg);
            return fail(res.status, { message: msg });
        }


        // You can change redirect target as needed
        throw redirect(303, `/dashboard/registration/payments/${driverId}`);
    },

    update: async ({ request, fetch, cookies }) => {
		const token = cookies.get('admin_token');
		if (!token) throw redirect(303, '/login');

		const formData = await request.formData();

		const paymentId = formData.get('paymentId');
		const payload = {
			amount: Number(formData.get('amount')),
			paymentMethod: formData.get('paymentMethod'),
			notes: formData.get('notes')
		};

		const res = await fetch(`https://api-freedom.com/api/v2/riders-program/payments/${paymentId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify(payload)
		});

		if (!res.ok) {
			const errorText = await res.text();
			console.error('Update failed:', errorText);
			return fail(res.status, { message: 'Failed to update payment' });
		}

		return { success: true };
	},

	delete: async ({ request, fetch, cookies }) => {
		const token = cookies.get('admin_token');
		if (!token) throw redirect(303, '/login');

		const formData = await request.formData();
		const paymentId = formData.get('paymentId');

		const res = await fetch(`https://api-freedom.com/api/v2/riders-program/payments/${paymentId}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${token}`
			}
		});

		if (!res.ok) {
			const errorText = await res.text();
			console.error('Delete failed:', errorText);
			return fail(res.status, { message: 'Failed to delete payment' });
		}

		return { success: true };
	}
};


