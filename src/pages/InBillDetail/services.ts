import { request } from 'umi';

export async function getInBillDetail(params?: any) {
  return request('/api/v1/base/in-bill/', {
    params,
  });
}
