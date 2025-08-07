import { Product, SOLD_OUT } from './types';

export const getRemainingStock = (stock: number, quantity?: number): number => {
  return stock - (quantity || 0);
};

export const formatAdminPrice = (product: Product): string => {
  return getRemainingStock(product.stock) <= 0 ? SOLD_OUT : `${product.price.toLocaleString()}원`;
};

export const formatUserPrice = (product: Product): string => {
  return getRemainingStock(product.stock) <= 0 ? SOLD_OUT : `₩${product.price.toLocaleString()}`;
};