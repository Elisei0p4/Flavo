import React from 'react';
import { createBrowserRouter, Navigate, Outlet, RouteObject } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { App } from '@/app/App';
import { Spinner } from '@/shared/ui/Spinner/Spinner';
import { useAuthStore } from '@/entities/user';

const HomePage = React.lazy(() => import('@/pages/HomePage'));
const ProductsPage = React.lazy(() => import('@/pages/ProductsPage'));
const ProductDetailPage = React.lazy(() => import('@/pages/ProductDetailPage'));
const CartPage = React.lazy(() => import('@/pages/CartPage'));
const CheckoutPage = React.lazy(() => import('@/pages/CheckoutPage')); 
const LoginPage = React.lazy(() => import('@/pages/LoginPage'));
const RegisterPage = React.lazy(() => import('@/pages/RegisterPage'));
const ProfilePage = React.lazy(() => import('@/pages/ProfilePage'));
const PaymentSuccessPage = React.lazy(() => import('@/pages/PaymentSuccessPage'));
const PaymentCancelPage = React.lazy(() => import('@/pages/PaymentCancelPage'));
const NotFoundPage = React.lazy(() => import('@/pages/NotFoundPage'));
const RecipesPage = React.lazy(() => import('@/pages/RecipesPage'));
const RecipeDetailPage = React.lazy(() => import('@/pages/RecipeDetailPage'));

const AuthLayout: React.FC<{ isPrivate?: boolean; isGuest?: boolean }> = ({ isPrivate, isGuest }) => {
  const { isAuthenticated, isInitialized } = useAuthStore(useShallow(state => ({
    isAuthenticated: state.isAuthenticated,
    isInitialized: state.isInitialized,
  })));

  if (!isInitialized) return <div className="h-screen flex items-center justify-center"><Spinner /></div>;
  if (isGuest && isAuthenticated) return <Navigate to="/profile" replace />;
  if (isPrivate && !isAuthenticated) return <Navigate to="/login" replace />;
  
  return <React.Suspense fallback={<div className="h-screen flex items-center justify-center"><Spinner /></div>}><Outlet /></React.Suspense>;
};

const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    errorElement: <React.Suspense fallback={<Spinner />}><NotFoundPage /></React.Suspense>,
    children: [
      { element: <AuthLayout />, children: [
        { index: true, element: <HomePage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'products/:productSlug', element: <ProductDetailPage /> },
        { path: 'recipes', element: <RecipesPage /> },
        { path: 'recipes/:recipeSlug', element: <RecipeDetailPage /> },
      ]},
      { element: <AuthLayout isGuest />, children: [
        { path: 'login', element: <LoginPage /> },
        { path: 'register', element: <RegisterPage /> },
      ]},
      { element: <AuthLayout isPrivate />, children: [
        { path: 'profile', element: <ProfilePage /> },
        { path: 'cart', element: <CartPage /> },
        { path: 'checkout', element: <CheckoutPage /> },
        { path: 'payment/success', element: <PaymentSuccessPage /> },
        { path: 'payment/cancel', element: <PaymentCancelPage /> },
      ]},
      { path: '*', element: <Navigate to="/404" replace /> },
    ],
  },
  {
    path: '/404',
    element: <React.Suspense fallback={<Spinner />}><NotFoundPage /></React.Suspense>,
  }
];

export const router = createBrowserRouter(routes);