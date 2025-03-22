import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
}

export const plans: SubscriptionPlan[] = [
  {
    id: 'price_free',
    name: 'Free',
    price: 0,
    interval: 'month',
    features: [
      'Basic resume generation',
      'Basic cover letter generation',
      'Standard templates',
      'PDF download',
      'Email support',
    ],
  },
  {
    id: 'price_pro',
    name: 'Pro',
    price: 19,
    interval: 'month',
    features: [
      'Advanced resume generation',
      'Advanced cover letter generation',
      'All templates',
      'AI-powered optimization',
      'Priority support',
      'Unlimited downloads',
      'Resume analytics',
    ],
  },
  {
    id: 'price_enterprise',
    name: 'Enterprise',
    price: 49,
    interval: 'month',
    features: [
      'Everything in Pro',
      'Custom templates',
      'API access',
      'Team collaboration',
      'Dedicated support',
      'Advanced analytics',
      'Custom branding',
    ],
  },
];

export const createCheckoutSession = async (
  priceId: string,
  userId: string
): Promise<string> => {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        userId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { sessionId } = await response.json();
    return sessionId;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

export const redirectToCheckout = async (sessionId: string) => {
  try {
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }

    const { error } = await stripe.redirectToCheckout({
      sessionId,
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error redirecting to checkout:', error);
    throw error;
  }
};

export const handleSubscription = async (userId: string, planId: string) => {
  try {
    const sessionId = await createCheckoutSession(planId, userId);
    await redirectToCheckout(sessionId);
  } catch (error) {
    console.error('Error handling subscription:', error);
    throw error;
  }
};

export const cancelSubscription = async (subscriptionId: string) => {
  try {
    const response = await fetch('/api/cancel-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscriptionId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to cancel subscription');
    }

    return await response.json();
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
};

export const updateSubscription = async (
  subscriptionId: string,
  newPriceId: string
) => {
  try {
    const response = await fetch('/api/update-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscriptionId,
        newPriceId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update subscription');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
}; 