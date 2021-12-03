import type { FormInstance } from 'antd';
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

export interface DataItem {
  key: string;
  value: string;
  price: number;
  p_name: string;
  ware_house: number;
  label: string;
}

const ProductSelect = (props: any) => {
  const {form, rowKey, menu, open} = props
  const [data, setData] = useState<DataItem[]>()
  const [display, setDisplay] = useState('block')
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    getProductSelectList().then((res) => {
      setData(res.data)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    console.log(menu, '状态', open)
    if (menu.props.open) {setDisplay("block")} else {setDisplay("none")}
  }, [menu.props.open])

  return (
    <div style={{display: display}}>
      <Table dataSource={data} columns={columns} pagination={false} size="small" loading={loading}
             onRow={record => {
               return {
                 onClick: () => {
                   form.setFieldsValue({ [rowKey]: { p_number: record.value } })
                   form.setFieldsValue({ [rowKey]: { unit_price: record.price } })
                   form.setFieldsValue({ [rowKey]: { p_name: record.p_name } })
                   form.setFieldsValue({ [rowKey]: { ware_house: record.ware_house.toString() } })
                   open()
                 }
               }
             }}
      />
    </div>
  )
}

// @ts-ignore
const productColumn = (form: FormInstance, { rowKey }) => {
  let open = true
  const changeOpen = (o: boolean) => {
    open = o
  }
  return {
    optionLabelProp: "value",
    showArrow: false,
    showSearch: true,
    dropdownRender: (menu: any) => {
      return (
        <ProductSelect form={form} rowKey={rowKey} menu={menu} open={changeOpen}/>
      )
    },
    onChange: () => {
      console.log("发生改变了")
    },
    open: open,
    onFocus: () => {
      console.log("获取焦点")
      changeOpen(true)
      console.log(open, "打开")
    },
    onClear:() => {
      form.setFieldsValue({[rowKey]: {unit_price: 0}})
      form.setFieldsValue({[rowKey]: {p_name: ''}})
      form.setFieldsValue({[rowKey]: {ware_house: ''}})
    }
  };
}

export default productColumn
