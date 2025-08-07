import { CartItem, Coupon, Product } from '../types';
import { calculateCartTotal, getRemainingStock } from '../utils';
import { useAtom } from 'jotai';
import { cartAtom } from '../../store/atoms/cartAtom';
import {
  ADD_TO_CART,
  CLEAR_CART,
  REMOVE_FROM_CART,
  UPDATE_QUANTITY,
} from '../constants';
import { productsAtom } from '../../store/atoms/productsAtom';
import { selectedCouponAtom } from '../../store/atoms/couponAtom';
import { useNotification } from './useNotification';

export const useCart = () => {
  const [cart, dispatch] = useAtom(cartAtom);
  const [products] = useAtom(productsAtom);
  const [selectedCoupon, setSelectedCoupon] = useAtom(selectedCouponAtom);
  const { addNotification } = useNotification();

  // 장바구니 상품 총 개수
  const totalItemCount = cart.reduce(
    (sum: number, item: CartItem) => sum + item.quantity,
    0
  );

  // 장바구니에 단일 상품 조회
  const getCartItem = (productId: string): CartItem | undefined => {
    return cart.find(item => item.product.id === productId);
  };

  // 장바구니에 상품 추가
  const addToCart = (product: Product) => {
    const cartItem = getCartItem(product.id);
    const remainingStock = getRemainingStock(product.stock, cartItem?.quantity);

    // 재고가 부족하면 알림 표시
    if (remainingStock <= 0) {
      addNotification('재고가 부족합니다!', 'error');
      return;
    }

    // 장바구니에 상품이 있으면 수량 증가
    if (cartItem) {
      // 재고 초과 시 알림 표시
      if (cartItem.quantity + 1 > product.stock) {
        addNotification(`재고는 ${product.stock}개까지만 있습니다.`, 'error');
        return;
      }

      dispatch({
        type: UPDATE_QUANTITY,
        payload: { productId: product.id, quantity: cartItem.quantity + 1 },
      });
      addNotification('장바구니에 담았습니다', 'success');
      return;
    }

    // 장바구니에 상품이 없으면 추가
    dispatch({ type: ADD_TO_CART, payload: { product } });
    addNotification('장바구니에 담았습니다', 'success');
    return;
  };

  // 장바구니에서 상품 제거
  const removeFromCart = (productId: string) => {
    dispatch({ type: REMOVE_FROM_CART, payload: { productId } });
  };

  // 장바구니에서 상품 수량 업데이트
  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) return;

    const maxStock = product.stock;
    if (newQuantity > maxStock) {
      addNotification(`재고는 ${maxStock}개까지만 있습니다.`, 'error');
      return;
    }

    dispatch({
      type: UPDATE_QUANTITY,
      payload: { productId, quantity: newQuantity },
    });
  };

  // 할인 쿠폰 적용
  const applyCoupon = (coupon: Coupon) => {
    const { totalAfterDiscount } = calculateCartTotal(cart, coupon);

    if (totalAfterDiscount < 10000 && coupon.discountType === 'percentage') {
      addNotification(
        'percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.',
        'error'
      );
      return;
    }

    setSelectedCoupon(coupon);
    addNotification('쿠폰이 적용되었습니다.', 'success');
  };

  // 장바구니 초기화
  const clearCart = () => {
    dispatch({ type: CLEAR_CART });
    setSelectedCoupon(null);
  };

  return {
    cart,
    selectedCoupon,
    setSelectedCoupon,
    totalItemCount,
    getCartItem,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    clearCart,
  };
};
