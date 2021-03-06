import { request } from 'umi';
import type { PayItem } from '@/pages/InList/index';
import { isNull } from 'lodash';

export async function getInStockList(params?: any) {
  if (params.status == undefined || isNull(params.status)) {
    params.status = 2
  }
  return request('/api/v1/base/stock/in', {
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

export async function deleteBill(params: any) {
  return request(`/api/v1/base/stock/${params.number}/`, { method: 'delete'}
    )
}
