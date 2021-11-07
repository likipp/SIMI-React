import { request } from 'umi';

export async function getExStockList(params?: any) {
  console.log(params, "参数")
  return request('/api/v1/base/stock/ex/', {
    params,
  });
}
