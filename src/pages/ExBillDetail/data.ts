import type React from 'react';

interface BaseBodyType {
  id: React.Key;
  p_number: string;
  p_number2: string;
  p_name: string;
  unit_price: number;
  ware_house: number;
  discount: number;
  total: number;
  crated_at: string;
}

interface BaseSourceType {
  id: React.Key;
  bill_number: string;
  bill_type: string;
  pay_method: string;
  created_at?: string;
  body: BaseBodyType[];
}

interface ExBodyType extends BaseBodyType {
  ex_qty: number
}

interface InBodyType extends BaseBodyType {
  in_qty: number
}

export interface ExSourceType extends BaseSourceType, ExBodyType{
  custom: number;
  c_number: number;
}


export interface InSourceType extends BaseSourceType, InBodyType{

}
