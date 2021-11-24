import { request } from 'umi';
import type { ProductListItem } from '@/pages/Product/data';

export async function getProductSelectList(params?: any) {
  return request('/api/v1/base/product-select/', {
    params: { param: params.keyWord },
  });
}

export async function getUnitSelectList(params: any) {
  return request('/api/v1/base/unit-select/', {
    params: { param: params.keyWord },
  });
}

export async function getBrandSelectList(params: any) {
  return request('/api/v1/base/brand-select/', {
    params: { param: params.keyWord },
  });
}

export async function getCustomList(params?: any) {
  return request('/api/v1/base/custom/', {
    params: { param: params.keyWord },
  });
}

export async function getCustomQueryList(params?: any) {
  return request('/api/v1/base/customQuery/', {
    params: { param: params.keyWord },
  });
}

export async function getWareHouseList(params?: any) {
  return request('/api/v1/base/warehouse/', {
    params: { param: params.keyWord },
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

export async function updateExBill(params: any) {
  return request(`/api/v1/base/stock/${params.bill_number}`, { method: 'patch', data:params});
}

export async function getProductList(params: any) {
  return request('/api/v1/base/product/', {
    params,
  });
}

export async function getCustomLevelList(params: any) {
  return request('/api/v1/base/custom-level-select/', {
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

export async function generateProductNumber(params: any) {
  return request('/api/v1/base/product-number/', {
    method: 'POST',
    params: {parent: params.parent},
    headers: {
      'content-type': 'application/json',
    },
  });
}

export async function updatesProduct(params: ProductListItem) {
  return request(`/api/v1/base/product/${params.id}`, { method: 'patch', data:params});
}

export async function getBrandTree() {
  return request('/api/v1/base/brand-tree/');
}
