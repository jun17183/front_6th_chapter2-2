import { useState } from "react";
import { ActiveTab, ProductsActions, CouponActions, NotificationActions, ACTIVE_TAB_PRODUCTS, ACTIVE_TAB_COUPONS } from "../shared/types";
import { AdminProducts } from "./pages/AdminProducts";
import { AdminCoupon } from "./pages/AdminCoupon";

export const AdminPage = ({
  productsActions,
  couponActions,
  notificationActions
}: {
  productsActions: ProductsActions;
  couponActions: CouponActions;
  notificationActions: NotificationActions;
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>(ACTIVE_TAB_PRODUCTS);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
      </div>
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button 
            onClick={() => setActiveTab(ACTIVE_TAB_PRODUCTS)}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === ACTIVE_TAB_PRODUCTS 
                ? 'border-gray-900 text-gray-900' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            상품 관리
          </button>
          <button 
            onClick={() => setActiveTab(ACTIVE_TAB_COUPONS)}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === ACTIVE_TAB_COUPONS 
                ? 'border-gray-900 text-gray-900' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            쿠폰 관리
          </button>
        </nav>
      </div>

      {activeTab === ACTIVE_TAB_PRODUCTS 
      ? <AdminProducts 
        productsActions={productsActions} 
        notificationActions={notificationActions}
      /> 
      : <AdminCoupon 
        couponActions={couponActions}
        notificationActions={notificationActions}
      />}
    </div>
  )
}
