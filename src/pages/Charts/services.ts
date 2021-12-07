import { request } from 'umi';

export async function getPayPie(params?: any) {
  return request('/api/v1/base/payable-pie/', {
    params,
  });
}

export async function getExColumn(params?: any) {
  return request('/api/v1/base/payable-column/', {
    params,
  });
}

export async function getProductSale(params?: any) {
  return request('/api/v1/base/product-sale/', {
    params,
  });
}
