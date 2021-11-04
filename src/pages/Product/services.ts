import { request } from 'umi';

export async function getProductList(params?: any) {
  return request('/api/v1/base/product/', {
    params: { param: params.keyWords },
  });
}

export async function getCustomList(params?: any) {
  return request('/api/v1/base/custom/', {
    params: { param: params.keyWords },
  });
}

export async function getCustomQueryList(params?: any) {
  return request('/api/v1/base/customQuery/', {
    params: { param: params.keyWords },
  });
}

export async function getWareHouseList(params?: any) {
  return request('/api/v1/base/warehouse/', {
    params: { param: params.keyWords },
  });
}

export async function createExBill(params: any) {
  console.log(params, 'params');
  return request('/api/v1/base/stock/', {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'content-type': 'application/json',
    },
  });
}
