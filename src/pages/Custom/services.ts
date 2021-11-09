import { request } from 'umi';
import { TableListItem } from '@/pages/Custom/index';

export async function getCustomList(params?: any) {
  return request('/api/v1/base/custom/', {
    params,
  });
}

export async function addCustom(params: TableListItem) {
  return request('/api/v1/base/custom', {
    method: 'POST',
    // 看Fetch官网资料里需要怎么转化下。
    body: JSON.stringify(params),
    headers: {
      'content-type': 'application/json',
    },
  });
}
