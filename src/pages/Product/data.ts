export type ProductListItem = {
  key: string;
  id: number;
  p_name: string;
  p_number: string;
  createdAt: number;
  brand: number;
  mark: string;
  p_spec: string
  purchase_price: number;
  sale_price: number;
  picture: any;
  unit: number;
  ware_house: number;
};

export type ProductQueryParams = {
  p_name: string;
  p_number: string;
  createdAt: number;
  brand: number;
  unit: number;
  ware_house: number;
}
