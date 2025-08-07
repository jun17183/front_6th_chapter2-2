import { CartItem, Coupon, Product, SOLD_OUT } from './types';

// 재고 계산
export const getRemainingStock = (stock: number, quantity?: number): number => {
  return stock - (quantity || 0);
};

// 관리자 가격 포맷
export const formatAdminPrice = (product: Product): string => {
  return getRemainingStock(product.stock) <= 0 ? SOLD_OUT : `${product.price.toLocaleString()}원`;
};

// 사용자 가격 포맷
export const formatUserPrice = (product: Product): string => {
  return getRemainingStock(product.stock) <= 0 ? SOLD_OUT : `₩${product.price.toLocaleString()}`;
};

// 대량 구매 여부 확인
export const hasBulkPurchase = (cart: CartItem[]): boolean => {
  return cart.some(cartItem => cartItem.quantity >= 10);
};

// 최대 적용 가능한 할인 계산
export const getMaxApplicableDiscount = (item: CartItem, cart: CartItem[]): number => {
  const { discounts } = item.product;
  const { quantity } = item;

  const baseDiscount = discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount
      ? discount.rate
      : maxDiscount;
  }, 0);

  return hasBulkPurchase(cart) ? Math.min(baseDiscount + 0.05, 0.5) : baseDiscount;
};

// 아이템 총 가격 계산
export const calculateItemTotal = (item: CartItem, cart: CartItem[]): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item, cart);

  return Math.round(price * quantity * (1 - discount));
};

// 카트 총 가격 계산
export const calculateCartTotal = (cart: CartItem[], selectedCoupon?: Coupon): {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
} => {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  cart.forEach(item => {
    totalBeforeDiscount += item.product.price * item.quantity;
    totalAfterDiscount += calculateItemTotal(item, cart);
  });

  if (selectedCoupon) {
    if (selectedCoupon.discountType === 'amount') {
      totalAfterDiscount = Math.max(
        0,
        totalAfterDiscount - selectedCoupon.discountValue
      );
    } else {
      totalAfterDiscount = Math.round(
        totalAfterDiscount * (1 - selectedCoupon.discountValue / 100)
      );
    }
  }

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
  };
};