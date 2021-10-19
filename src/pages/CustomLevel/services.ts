import { request } from 'umi';

export async function getCustomLevelList(params?: any) {
  return request('/api/v1/base/custom-level/', {
    params,
  });
}
