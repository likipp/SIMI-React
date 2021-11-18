import type { FormInstance } from 'antd';
// @ts-ignore
const productColumn = (form: FormInstance, { rowKey }) => {
  return {
    optionItemRender(item: { key: string; value: string }) {
      return item.value + ' - ' + item.key;
    },
    showArrow: false,
    showSearch: true,
    onChange: (value: any, item: any) => {
      form.setFieldsValue({[rowKey]: {unit_price: item.price}})
      form.setFieldsValue({[rowKey]: {p_name: item.p_name}})
      form.setFieldsValue({[rowKey]: {ware_house: item.ware_house.toString()}})
    },
    onSelect: (value: any, option: any) => {
      option.label = value;
      option["data-item"].label = value;
    }
  };
}

export default productColumn
