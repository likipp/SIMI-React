import { request } from '@@/plugin-request/request';

export async function getStockList(params?: any) {
  return request('/api/v1/base/stock/', {
    params,
  });
}
