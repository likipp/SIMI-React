import { request } from 'umi';

export async function getProductList(params?: any) {
  return request('/api/v1/base/product/', {
    params,
  });
}
