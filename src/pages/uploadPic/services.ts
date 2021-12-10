import { request } from '@@/plugin-request/request';

export async function uploadPic(params: any) {
  const formData = new FormData()
  formData.append('file', params)
  return request('/api/v1/base/image/', {
    method: 'POST',
    // 看Fetch官网资料里需要怎么转化下。
    body: formData,
    headers: {
      'content-type': 'multipart/form-data',
    },
  });
}
