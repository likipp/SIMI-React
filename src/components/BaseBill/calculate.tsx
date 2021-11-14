import toDecimal2 from '@/utils/toDecimal2';

const calculate = (unit_price: number, in_discount: number, ex_discount: number, qty: number) => {
  // if (in_discount == undefined) {
  //   in_discount = 100
  // }
  // if (ex_discount == undefined) {
  //   ex_discount = 100
  // }
  const total: number = toDecimal2((unit_price * qty * ex_discount) / 100);
  const cost: number = toDecimal2((unit_price * qty * in_discount) / 100);
  const profit = toDecimal2(total - cost)
  return [total, cost, profit]
}

export default calculate
