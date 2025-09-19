import { Decimal } from 'decimal.js';

/**
 * Форматирует денежное значение для отображения
 * @param value - значение в виде строки или числа
 * @returns отформатированная строка с символом рубля
 */
export const formatMoney = (value: string | number): string => {
  const decimal = new Decimal(value);
  return `${decimal.toFixed(2)} ₽`;
};

/**
 * Форматирует денежное значение для отображения без копеек (целое число)
 * @param value - значение в виде строки или числа
 * @returns отформатированная строка с символом рубля
 */
export const formatMoneyInteger = (value: string | number): string => {
  const decimal = new Decimal(value);
  return `${decimal.toFixed(0)} ₽`;
};

/**
 * Вычисляет общую стоимость товара
 * @param price - цена за единицу
 * @param quantity - количество
 * @returns общая стоимость
 */
export const calculateItemTotal = (price: string | number, quantity: number): number => {
  const priceDecimal = new Decimal(price);
  const quantityDecimal = new Decimal(quantity);
  return priceDecimal.mul(quantityDecimal).toNumber();
};

/**
 * Вычисляет общую стоимость корзины
 * @param items - массив товаров с полями price и quantity
 * @returns общая стоимость
 */
export const calculateCartTotal = (items: Array<{ price: string | number; quantity: number }>): number => {
  const total = items.reduce((sum, item) => {
    const price = new Decimal(item.price);
    const quantity = new Decimal(item.quantity);
    return sum.add(price.mul(quantity));
  }, new Decimal(0));
  return total.toNumber();
};

/**
 * Конвертирует строку в число с использованием Decimal
 * @param value - значение для конвертации
 * @returns число
 */
export const parseDecimal = (value: string | number): number => {
  return new Decimal(value).toNumber();
};
