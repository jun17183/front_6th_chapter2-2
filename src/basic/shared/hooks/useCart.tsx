import { useAppState } from './useAppState';
import { useNotification } from './useNotification';
import { CartItem, Coupon, Product } from '../types';
import { calculateCartTotal, getRemainingStock } from '../utils';

export const useCart = (
  appState: ReturnType<typeof useAppState>,
  notificationActions: ReturnType<typeof useNotification>
) => {
  const { cart, setCart, products, setSelectedCoupon } =
    appState;
  const { addNotification } = notificationActions;

  // 장바구니 상품 총 개수
  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // 장바구니에 단일 상품 조회
  const getCartItem = (productId: string): CartItem | undefined => {
    return cart.find(item => item.product.id === productId);
  };

  // 장바구니에 상품 추가
  const addToCart = (product: Product) => {
    const cartItem = getCartItem(product.id);
    const remainingStock = getRemainingStock(product.stock, cartItem?.quantity);

    if (remainingStock <= 0) {
      addNotification('재고가 부족합니다!', 'error');
      return;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(
        item => item.product.id === product.id
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + 1;

        if (newQuantity > product.stock) {
          addNotification(`재고는 ${product.stock}개까지만 있습니다.`, 'error');
          return prevCart;
        }

        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      }

      return [...prevCart, { product, quantity: 1 }];
    });

    addNotification('장바구니에 담았습니다', 'success');
  };

  // 장바구니에서 상품 제거
  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
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

    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
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

  const clearCart = () => {
    setCart([]);
    setSelectedCoupon(null);
  };

  return {
    cart,
    totalItemCount,
    getCartItem,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    clearCart,
  };
};
