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
    id: 'free',
    name: 'Free',
    price: 0,
    features: [
      'Basic resume analysis',
      'ATS compatibility check',
      'One resume template',
      'PDF export',
      '2 resume generations per month'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19,
    features: [
      'All Free features',
      'Advanced resume analysis',
      'Unlimited resume generations',
      '5 premium templates',
      'Cover letter generation',
      'Job description matching',
      'LinkedIn profile optimization'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 49,
    features: [
      'All Pro features',
      'Priority support',
      'Bulk resume analysis',
      'Custom templates',
      'API access',
      'Team collaboration',
      'Advanced analytics',
      'Dedicated account manager'
    ]
  }
];

export const getSubscriptionDetails = async (userId: string) => {
  // Mock implementation - in a real app, this would fetch from your backend
  return {
    plan: 'free',
    status: 'active',
    nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    features: plans[0].features
  };
};

export const createCheckoutSession = async (priceId: string, customerId: string) => {
  // Mock implementation
  console.log(`Creating checkout session for price ${priceId} and customer ${customerId}`);
  return {
    sessionId: 'mock_session_id',
    url: 'https://example.com/checkout'
  };
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