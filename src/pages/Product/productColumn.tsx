import type { FormInstance } from 'antd';
import { getStockList } from '@/pages/ExistingStock/services';
import { parseInt } from 'lodash';

// @ts-ignore
const productColumn = (form: FormInstance, { rowKey }) => {
  return {
    optionItemRender(item: { key: string; value: string }) {
      return item.value + ' - ' + item.key;
    },
    optionLabelProp: "value",
    showArrow: false,
    showSearch: true,
    onChange: async (value: any, item: any) => {
      if (value) {
        form.setFieldsValue({ [rowKey]: { unit_price: item.price } })
        form.setFieldsValue({ [rowKey]: { p_name: item.p_name } })
        form.setFieldsValue({ [rowKey]: { ware_house: item.ware_house.toString() } })
        const col = form.getFieldsValue(true)
        if (Object.keys(col).length !== 0) {
          const p_number = col[rowKey as string].p_number
          const ware_house = col[rowKey as string].ware_house
          // const stock = await Promise.resolve(getStockList({ p_number: p_number, ware_house: parseInt(ware_house) }))
          // console.log(stock.data.length, "stock.data.length")
          // if (stock.data.length !== 0) {
          //   // console.log(stock.data[0].qty)
          //   // form.setFieldsValue({ [rowKey]: { stock: stock.data[0].qty } })
          //   await form.setFieldsValue({ [rowKey]: { stock: stock.data[0].qty } })
          //   console.log(form.getFieldsValue(true), "物料的字段")
          // }

          getStockList({ p_number: p_number, ware_house: parseInt(ware_house)}).then((res) => {
            if (Object.keys(res.data).length !== 0) {
              form.setFieldsValue({[rowKey as string]: {stock: res.data[0].qty}})
              console.log(form.getFieldsValue(true))
            } else {
              form.setFieldsValue({[rowKey as string]: {stock: 0}})
            }
          })
        }
      }
    },
    // onSelect: (value: any, option: any) => {
    //   option.label = value;
    //   option.children = value;
    //   option["data-item"].label = value;
    // },
    onClear:() => {
      form.setFieldsValue({[rowKey]: {unit_price: 0}})
      form.setFieldsValue({[rowKey]: {p_name: ''}})
      form.setFieldsValue({[rowKey]: {ware_house: ''}})
    }
  };
}

export default productColumn
