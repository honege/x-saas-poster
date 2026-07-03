import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  apiVersion: '2023-10-16',
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = (session.user as any).id;
    const userEmail = session.user.email || '';

    const body = await req.json();
    const { planId } = body;

    if (!planId) {
      return NextResponse.json({ error: 'Plan ID is required' }, { status: 400 });
    }

    // Map your local plan IDs to actual Stripe Price IDs
    // For this demo, we'll use dummy price IDs if env vars are missing
    const priceMap: Record<string, string> = {
      'LITE': process.env.STRIPE_PRICE_LITE || 'price_lite_dummy',
      'STANDARD': process.env.STRIPE_PRICE_STANDARD || 'price_standard_dummy',
      'PREMIUM': process.env.STRIPE_PRICE_PREMIUM || 'price_premium_dummy',
      'MASTER': process.env.STRIPE_PRICE_MASTER || 'price_master_dummy',
    };

    const priceId = priceMap[planId];

    if (!priceId) {
      return NextResponse.json({ error: 'Invalid Plan ID' }, { status: 400 });
    }

    // Create Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: userEmail,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pricing?canceled=true`,
      metadata: {
        userId: userId,
        planId: planId,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
