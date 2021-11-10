import { request } from 'umi';
import type { ProductListItem } from '@/pages/Product/data';

export async function getProductSelectList(params?: any) {
  return request('/api/v1/base/product-select/', {
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
  return request('/api/v1/base/stock/', {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'content-type': 'application/json',
    },
  });
}

export async function getProductList(params: any) {
  return request('/api/v1/base/product/', {
    params,
  });
}

export async function getUnitSelectList(params: any) {
  return request('/api/v1/base/unit-select/', {
    params,
  });
}

export async function getBrandSelectList(params: any) {
  return request('/api/v1/base/brand-select/', {
    params,
  });
}

export async function addProduct(params: ProductListItem) {
  return request('/api/v1/base/product/', {
    method: 'POST',
    // 看Fetch官网资料里需要怎么转化下。
    body: JSON.stringify(params),
    headers: {
      'content-type': 'application/json',
    },
  });
}

export async function updatesProduct(params: ProductListItem) {
  console.log(params, "params", params.id)
  return request(`/api/v1/base/product/${params.id}`, { method: 'patch', data:params});
}
