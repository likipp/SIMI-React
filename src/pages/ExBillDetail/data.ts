import type React from 'react';

export interface DataSourceType {
  id: React.Key;
  number: string;
  custom: number;
  type: string;
  c_number: number;
  pay_method: string;
  p_number: string;
  p_number2: string;
  p_name: string;
  unit_price: number;
  ware_house: number;
  discount: number;
  ex_qty: number;
  total: number;
  created_at?: string;
  body: DataSourceType[];
}
