import toDecimal2 from '@/utils/toDecimal2';
import { FormInstance } from 'antd';

const calculateExWithList = (list: any, listKey: any) => {
    const qty = list[listKey].ex_qty;
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

const calculateEx = (record: any) => {
  const qty = record.ex_qty;
  const unit_price = record.unit_price;
  let in_discount = record.in_discount;
  let ex_discount = record.ex_discount;
  if (in_discount == undefined) {
    in_discount = 100;
  }
  if (ex_discount == undefined) {
    ex_discount = 100;
  }
  const r_total: number = toDecimal2((unit_price * qty * ex_discount) / 100);
  const r_cost: number = toDecimal2((unit_price * qty * in_discount) / 100);
  const r_profit = toDecimal2(r_total - r_cost);
  record.cost = r_cost
  record.profit = r_profit
  record.total = r_total
}

const calculateInWithList = (list: any, listKey: any) => {
  const qty = list[listKey].in_qty;
  const unit_price = list[listKey].unit_price;
  let in_discount = list[listKey].in_discount;
  if (in_discount == undefined) {
    in_discount = 100;
  }
  return toDecimal2((unit_price * qty * in_discount) / 100)
}

const calculateIn = (record: any) => {
  const qty = record.in_qty;
  const unit_price = record.unit_price;
  let in_discount = record.in_discount;
  if (in_discount == undefined) {
    in_discount = 100;
  }
  return toDecimal2((unit_price * qty * in_discount) / 100)
}

// export {calculateEx, calculateExWithList, calculateIn, calculateInWithList}

const discountChange = (record: any, recordList: any, type: string, form: FormInstance<any>) => {
  const list = form.getFieldsValue(true);
  if (record != undefined) {
    if (type == '出库单') {
      calculateEx(record)
      for (const listKey in list) {
        const {total, cost, profit} =  calculateExWithList(list, listKey)
        form.setFieldsValue({
          [listKey]: { total: total },
        });
        form.setFieldsValue({
          [listKey]: { cost: cost },
        });
        form.setFieldsValue({
          [listKey]: { profit: profit },
        });
      }
    } else {
      record.total = calculateIn(record)
      for (const listKey in list) {
        list[listKey].total = calculateInWithList(list, listKey);
      }
    }
    return;
  }
};

export default discountChange
