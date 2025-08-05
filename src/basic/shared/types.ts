import { useCart } from "../features/cart/hooks/useCart";
import { useCoupon } from "../features/coupon/hooks/useCoupon";
import { useProducts } from "../features/products/hooks/useProducts";
import { useAppState } from "./hooks/useAppState";
import { useNotification } from "./hooks/useNotification";

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  discounts: Discount[];
  description?: string;
  isRecommended?: boolean;
}

export interface Discount {
  quantity: number;
  rate: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Coupon {
  name: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
}

export interface Notification {
  id: string;
  message: string;
  type: 'error' | 'success' | 'warning';
}

export type AppState = ReturnType<typeof useAppState>;
export type CartActions = ReturnType<typeof useCart>;
export type ProductsActions = ReturnType<typeof useProducts>;
export type CouponActions = ReturnType<typeof useCoupon>;
export type NotificationActions = ReturnType<typeof useNotification>;

export const SOLD_OUT = 'SOLD OUT';
export const ACTIVE_TAB_PRODUCTS = 'products';
export const ACTIVE_TAB_COUPONS = 'coupons';
export const DISCOUNT_TYPE_AMOUNT = 'amount';
export const DISCOUNT_TYPE_PERCENTAGE = 'percentage';

export type ActiveTab = typeof ACTIVE_TAB_PRODUCTS | typeof ACTIVE_TAB_COUPONS;
export type DiscountType = typeof DISCOUNT_TYPE_AMOUNT | typeof DISCOUNT_TYPE_PERCENTAGE;
