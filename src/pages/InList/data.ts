export type InTableListItem = {
  id: number;
  number: string;
  created_at: number;
  pay_method: string;
  p_number: string;
  p_name: string;
  in_qty: number;
  unit_price: number;
  bill_amount: number;
  remain_amount: number;
  rowSpan: number;
  status: number;
};

export type PayItem = {
  source_bill: number;
  bill_amount: number;
  remain_amount: number;
  number: string;
  status: number;
};



