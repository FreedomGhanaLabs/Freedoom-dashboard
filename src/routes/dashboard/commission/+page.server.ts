import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ cookies, fetch }) => {
  const token = cookies.get('admin_token');
  if (!token) {
    throw redirect(303, '/');
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };

  const configPromise = fetch('https://api-freedom.com/api/v2/admin/commission/config', {
    method: 'GET',
    headers
  });
  const ratesPromise = fetch('https://api-freedom.com/api/v2/admin/commission/rates', {
    method: 'GET',
    headers
  });

  const [configRes, ratesRes] = await Promise.all([configPromise, ratesPromise]);

  if (!configRes.ok) {
    throw error(configRes.status, `Failed to load commission configuration (${configRes.status})`);
  }
  if (!ratesRes.ok) {
    throw error(ratesRes.status, `Failed to load commission rates (${ratesRes.status})`);
  }

  const configPayload = await configRes.json();
  const ratesPayload = await ratesRes.json();

  const commission = configPayload.data ?? {};
  
  const rates = ratesPayload.data ?? {};

  return {
    commission,
    rates
  };
};

export const actions: Actions = {
  default: async ({ request, cookies, fetch }) => {
    const token = cookies.get('admin_token');
    if (!token) {
      throw redirect(303, '/login');
    }

    const formData = await request.formData();
    const formType = formData.get('formType');

    if (formType === 'commission') {
      const raw = formData.get('commissionData') as string;
      if (!raw) {
        throw error(400, 'Commission data is missing');
      }

      let commissionData;
      try {
        commissionData = JSON.parse(raw);
      } catch {
        throw error(400, 'Invalid commission data format');
      }

      if (
        !commissionData.defaultRates ||
        !commissionData.paymentMethodRates ||
        !commissionData.serviceTypeRates ||
        !commissionData.fees ||
        commissionData.minimumThreshold === undefined
      ) {
        throw error(400, 'Missing required commission configuration fields');
      }

      const response = await fetch('https://api-freedom.com/api/v2/admin/commission/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(commissionData)
      });

     console.log('PUT request sent to API', response);
    console.log('Response status:', response.status);
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.log('Response error:', err);
      throw error(
        response.status,
        err.msg || 'Failed to update commission configuration'
      );
    }



      const updated = await response.json();
      console.log('API response status:', response.status);
      console.log('API response body:', updated);
      return {
        success: true,
        commissionConfig: updated.data
      };
    } else if (formType === 'expense') {
      try {
        const amount = parseFloat(formData.get('amount') as string);
        const category = formData.get('category') as string;
        const description = formData.get('description') as string;
        const reference = formData.get('reference') as string;
        const currency = formData.get('currency') as string;

        if (isNaN(amount) || !category || !description || !reference || !currency) {
          throw error(400, 'All expense fields are required');
        }


        const payload = {
          amount,
          category,
          description,
          reference,
          currency
        };

      
        console.log('Sending expense payload to API:', JSON.stringify(payload, null, 2));

     
        const response = await fetch('https://api-freedom.com/api/v2/admin/commission/expenses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        const responseText = await response.text();
        console.log('API response status:', response.status);
        console.log('API response body:', responseText);

        if (!response.ok) {
          let err;
          try {
            err = JSON.parse(responseText);
          } catch {
            err = { msg: responseText };
          }
          console.error('API error response:', err);
          throw error(response.status, err.msg || 'Failed to record expense');
        }

        const result = JSON.parse(responseText);

        if (!result.data || !result.data._id) {
          console.error('Expense response missing data or _id:', result);
          throw error(500, 'Expense data is missing _id');
        }

        console.log('Expense recorded:', result.data);

        return {
          success: true,
          expense: result.data
        };
      } catch (err) {
        console.error('Error recording expense:', err);
        throw err;
      }
    }
  }
};