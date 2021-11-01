import { request } from '@@/plugin-request/request';

export async function getBillNumber(params: any) {
  return request('/api/v1/base/generate-number/', {
    params: { type: params.type},
  });
}
