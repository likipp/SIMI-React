import { request } from 'umi';

export async function getProductList(params?: any) {
  return request('/api/v1/base/product/', {
    params: {param: params.keyWords}
  });
}

export async function getCustomList(params?: any) {
  return request('/api/v1/base/custom/', {
    params: {param: params.keyWords}
  });
}
