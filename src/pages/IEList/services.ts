import { request } from 'umi';

export async function getInExStockList(params?: any) {
  return request('/api/v1/base/stock/list/', {
    params,
  });
}
