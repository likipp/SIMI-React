export type ProductListItem = {
  key: string;
  id: number;
  p_name: string;
  p_number: string;
  createdAt: number;
  brand: number;
  mark: string;
  p_spec: string
  p_price: number;
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
