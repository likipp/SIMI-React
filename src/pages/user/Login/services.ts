import { request } from '@@/plugin-request/request';
import type { LoginParamsType } from '@/pages/user/Login/data';

export async function UserLogin(params: LoginParamsType) {
  return request('/api/v1/base/login', {
    method: 'POST',
    data: params,
  });
}
