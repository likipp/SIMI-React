import { request } from 'umi';

export async function getInStockList(params?: any) {
  return request('/api/v1/base/stock/in/', {
    params,
  });
}
