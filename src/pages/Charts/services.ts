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

export async function getProfitCompare(params?: any) {
  return request('/api/v1/base/profit-compare/', {
    params,
  });
}

export async function getSumTotal(params?: any) {
  return request('/api/v1/base/sum-total/', {
    params,
  });
}

export async function getSumCost(params?: any) {
  return request('/api/v1/base/sum-cost/', {
    params,
  });
}
