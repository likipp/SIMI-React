import { getProductList, getWareHouseList } from '@/pages/Product/services';

const requestProduct = async (keyWords: any) => {
  return Promise.resolve(getProductList(keyWords)).then((res) => {
    return res.data;
  });
};

const requestWareHouse = async (keyWords: any) => {
  return Promise.resolve(getWareHouseList(keyWords)).then((res) => {
    return res.data;
  });
};

export { requestProduct, requestWareHouse };
