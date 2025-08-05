import { useState, useCallback, useEffect } from 'react';
import { useAppState } from './shared/hooks/useAppState';
import { useCart } from './features/cart/hooks/useCart';
import { AdminPage } from './pages/admin';
import { UserPage } from './pages/user';
import { Notifications } from './shared/components/Notifications';
import { useNotification } from './shared/hooks/useNotification';
import { Header } from './shared/components/Header';
import { useProducts } from './features/products/hooks/useProducts';
import { useCoupon } from './features/coupon/hooks/useCoupon';

const App = () => {
  const appState = useAppState();
  const notificationActions = useNotification();
  const cartActions = useCart(appState, notificationActions);
  const productsActions = useProducts(appState, notificationActions);
  const couponActions = useCoupon(appState, notificationActions);

  const { isAdmin } = appState;

  return (
    <div className="min-h-screen bg-gray-50">
      <Notifications 
        notificationActions={notificationActions}
      />

      <Header appState={appState} cartActions={cartActions} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin 
          ? <AdminPage 
            productsActions={productsActions} 
            couponActions={couponActions}
            notificationActions={notificationActions} 
          /> 
          : <UserPage 
            appState={appState}
            productsActions={productsActions} 
            couponActions={couponActions}
            cartActions={cartActions} 
            notificationActions={notificationActions} 
          />}
      </main>
    </div>
  );
};

export default App;