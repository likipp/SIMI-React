import toDecimal2 from '@/utils/toDecimal2';

const calculateEx = (qty: number, list: any, listKey: any) => {
    qty = list[listKey].ex_qty;
    const unit_price = list[listKey].unit_price;
    let in_discount = list[listKey].in_discount;
    let ex_discount = list[listKey].ex_discount;
    if (in_discount == undefined) {
      in_discount = 100;
    }
    if (ex_discount == undefined) {
      ex_discount = 100;
    }
  const total: number = toDecimal2((unit_price * qty * ex_discount) / 100);
  const cost: number = toDecimal2((unit_price * qty * in_discount) / 100);
  const profit = toDecimal2(total - cost);
  return {total, cost, profit}
}
// const {total, cost, profit} =  CalculateEx(qty, list, listKey)
export default calculateEx
