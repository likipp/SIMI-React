// import type React from 'react';

// export interface BaseBodyType {
//   key: string;
//   id: number;
//   p_number: string;
//   p_number2: string;
//   p_name: string;
//   unit_price: number;
//   ware_house: number;
//   discount: number;
//   total: number;
//   createdAt: string;
// }

// interface BaseSourceType {
//   id: number;
//   bill_number: string;
//   bill_type: string;
//   pay_method: string;
//   created_at?: string;
//   body: BaseBodyType[];
// }

export interface ExBodyType {
  key: string;
  id: number;
  p_number: string;
  p_number2: string;
  p_name: string;
  unit_price: number;
  ware_house: number;
  discount: number;
  total: number;
  createdAt: string;
  stock: number;
  ex_qty: number
  cost: number
  profit: number
  ex_discount: number
  in_discount: number
}

export interface InBodyType {
  key: string;
  id: number;
  p_number: string;
  p_number2: string;
  p_name: string;
  unit_price: number;
  ware_house: string;
  discount: number;
  total: number;
  createdAt: string;
  in_qty: number
}

export interface ExSourceType {
  id: number;
  bill_number: string;
  bill_type: string;
  pay_method: string;
  createdAt?: string;
  custom: number;
  c_name: string;
  c_number: string;
  body: ExBodyType[]
}

export interface InSourceType {
  id: number;
  bill_number: string;
  bill_type: string;
  createdAt?: string;
  body: InBodyType[];
}
