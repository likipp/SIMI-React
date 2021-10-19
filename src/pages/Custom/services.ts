import { request } from 'umi';

export async function getCustomList(params?: any) {
  return request('/api/v1/base/custom/', {
    params,
  });
}
