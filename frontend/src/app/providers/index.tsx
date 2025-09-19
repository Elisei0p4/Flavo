import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { router } from '@/shared/config/router';

const queryClient = new QueryClient();
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const AppProvider: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Elements stripe={stripePromise}>
        <RouterProvider router={router} />
      </Elements>
    </QueryClientProvider>
  );
};