import type { FormInstance } from 'antd';
import { getStockList } from '@/pages/ExistingStock/services';
import { parseInt } from 'lodash';
import { Table } from 'antd';
import { useEffect, useState } from 'react';
import { getProductSelectList } from '@/pages/Product/services';

const columns = [
  {
    title: '代码',
    dataIndex: 'value',
    key: 'value',
  },
  {
    title: '名称',
    dataIndex: 'p_name',
    key: 'label',
  },
];

const ProductSelect = (props: any) => {
  const {form, rowKey, menu} = props
  const [data, setData] = useState()
  useEffect(() => {
    getProductSelectList().then((res) => {
      setData(res.data)
    })
  }, [])

  return (
    <Table dataSource={data} columns={columns} pagination={false} size="small"
      onRow={record => {
        return {
          onClick: () => {
            form.setFieldsValue({ [rowKey]: { p_number: record.value } })
            form.setFieldsValue({ [rowKey]: { unit_price: record.price } })
            form.setFieldsValue({ [rowKey]: { p_name: record.p_name } })
            form.setFieldsValue({ [rowKey]: { ware_house: record.ware_house.toString() } })
            const col = form.getFieldsValue(true)
            if (Object.keys(col).length !== 0) {
              const p_number = col[rowKey as string].p_number
              const ware_house = col[rowKey as string].ware_house
              getStockList({ p_number: p_number, ware_house: parseInt(ware_house)}).then((res) => {
                if (Object.keys(res.data).length !== 0) {
                  form.setFieldsValue({[rowKey as string]: {stock: res.data[0].qty}})
                } else {
                  form.setFieldsValue({[rowKey as string]: {stock: 0}})
                }
              })
            }
            console.log(menu, "菜单")
          }
        }
      }}
    />
  )
}

// @ts-ignore
const productColumn = (form: FormInstance, { rowKey }) => {
  const changeOpen = (status: boolean) => {
    console.log(status, "状态")
    return false
  }
  return {
    // optionItemRender(item: { key: string; value: string }) {
    //   return item.value + ' - ' + item.key;
    // },
    // optionLabelProp: "value",
    showArrow: false,
    showSearch: true,
    // onChange: async (value: any, item: any) => {
    //   if (value) {
    //     form.setFieldsValue({ [rowKey]: { unit_price: item.price } })
    //     form.setFieldsValue({ [rowKey]: { p_name: item.p_name } })
    //     form.setFieldsValue({ [rowKey]: { ware_house: item.ware_house.toString() } })
    //     const col = form.getFieldsValue(true)
    //     if (Object.keys(col).length !== 0) {
    //       const p_number = col[rowKey as string].p_number
    //       const ware_house = col[rowKey as string].ware_house
    //       // const stock = await Promise.resolve(getStockList({ p_number: p_number, ware_house: parseInt(ware_house) }))
    //       // console.log(stock.data.length, "stock.data.length")
    //       // if (stock.data.length !== 0) {
    //       //   // console.log(stock.data[0].qty)
    //       //   // form.setFieldsValue({ [rowKey]: { stock: stock.data[0].qty } })
    //       //   await form.setFieldsValue({ [rowKey]: { stock: stock.data[0].qty } })
    //       //   console.log(form.getFieldsValue(true), "物料的字段")
    //       // }
    //
    //       getStockList({ p_number: p_number, ware_house: parseInt(ware_house)}).then((res) => {
    //         if (Object.keys(res.data).length !== 0) {
    //           form.setFieldsValue({[rowKey as string]: {stock: res.data[0].qty}})
    //           console.log(form.getFieldsValue(true))
    //         } else {
    //           form.setFieldsValue({[rowKey as string]: {stock: 0}})
    //         }
    //       })
    //     }
    //   }
    // },
    dropdownRender: () => {
      return (
        <ProductSelect form={form} rowKey={rowKey} menu={changeOpen(true)}/>
      )
    },
    onDropdownVisibleChange: (open: boolean) => {
      changeOpen(open)
    },
    onClear:() => {
      form.setFieldsValue({[rowKey]: {unit_price: 0}})
      form.setFieldsValue({[rowKey]: {p_name: ''}})
      form.setFieldsValue({[rowKey]: {ware_house: ''}})
    }
  };
}

export default productColumn
