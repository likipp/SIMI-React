import { request } from 'umi';
import type { PayItem } from '@/pages/InList/index';

export async function getInStockList(params?: any) {
  return request('/api/v1/base/stock/in/', {
    params,
  });
}

export async function updatePayDiscount(params: PayItem) {
  return request('/api/v1/base/payable/', {
    method: 'POST',
    // 看Fetch官网资料里需要怎么转化下。
    body: JSON.stringify(params),
    headers: {
      'content-type': 'application/json',
    },
  });
}

export async function getPayList(params: any) {
  return request('/api/v1/base/payable/', {
    params,
  });
}
