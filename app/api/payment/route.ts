import { type NextRequest } from 'next/server';
import { z } from 'zod';
import { createPaymentAction, getPaymentsByClientId } from '@/src/actions/payment.actions';

const createPaymentSchema = z.object({
  contractId: z.string().min(1, 'Contract ID is required'),
  amount: z.number().positive('Amount must be positive'),
  paymentDate: z.string().datetime('Invalid payment date'),
  comment: z.string().optional(),
});

const getPaymentsSchema = z.object({
  clientId: z.string().min(1, 'Client ID is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Payment request body:', body);
    
    const data = createPaymentSchema.parse(body);
    console.log('Parsed payment data:', data);

    const result = await createPaymentAction(
      data.contractId,
      data.amount,
      new Date(data.paymentDate),
      data.comment
    );

    if (!result.success) {
      console.error('Payment creation failed:', result.error);
      return Response.json({ error: result.error }, { status: 400 });
    }

    return Response.json({ success: true, data: result.data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors);
      return Response.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error creating payment:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');

    if (!clientId) {
      return Response.json({ error: 'Client ID is required' }, { status: 400 });
    }

    const payments = await getPaymentsByClientId(clientId);
    return Response.json({ success: true, data: payments });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
