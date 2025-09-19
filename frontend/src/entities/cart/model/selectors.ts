import { Decimal } from 'decimal.js';
import { useCartStore } from './store';


export const useSelectTotalItems = () => {
  return useCartStore((state) => state.items.reduce((total, item) => total + item.quantity, 0));
};

export const useSelectTotalPrice = () => {
  return useCartStore((state) => {
    const total = state.items.reduce((sum, item) => {
      const price = new Decimal(item.price);
      const quantity = new Decimal(item.quantity);
      return sum.add(price.mul(quantity));
    }, new Decimal(0));
    return total.toNumber();
  });
};
