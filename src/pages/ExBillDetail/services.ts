import { request } from 'umi';

export async function getExBillDetail(params?: any) {
  return request('/api/v1/base/ex-bill/', {
    params,
  });
}
