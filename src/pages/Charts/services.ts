import { request } from 'umi';

export async function getPayPie(params?: any) {
  return request('/api/v1/base/payable-pie/', {
    params,
  });
}
