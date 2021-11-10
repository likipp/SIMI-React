import {
  getBrandSelectList, getCustomLevelList,
  getProductSelectList,
  getUnitSelectList,
  getWareHouseList,
} from '@/pages/Product/services';

const requestProduct = async (keyWords: any) => {
  return Promise.resolve(getProductSelectList(keyWords)).then((res) => {
    return res.data;
  });
};

const requestWareHouse = async (keyWords: any) => {
  return Promise.resolve(getWareHouseList(keyWords)).then((res) => {
    return res.data;
  });
};

const requestUnitSelectList = async (keyWords: any) => {
  return Promise.resolve(getUnitSelectList(keyWords)).then((res) => {
    return res.data;
  });
};

const requestBrandSelectList  = async (keyWords: any) => {
  return Promise.resolve(getBrandSelectList(keyWords)).then((res) => {
    return res.data;
  });
};

const requestCustomLevelSelectList = async (keyWords: any) => {
  return Promise.resolve(getCustomLevelList(keyWords)).then((res) => {
    return res.data;
  });
}

export { requestProduct, requestWareHouse, requestUnitSelectList, requestBrandSelectList, requestCustomLevelSelectList };
