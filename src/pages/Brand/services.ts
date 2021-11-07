import { request } from '@@/plugin-request/request';

export async function getBrandTree(params?: any) {
  return request('/api/v1/base/brand-tree/', {
    params,
  });
}
