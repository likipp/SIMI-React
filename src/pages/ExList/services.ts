import { request } from 'umi';

export async function getExStockList(params?: any) {
  return request('/api/v1/base/stock/ex/', {
    params,
  });
}
