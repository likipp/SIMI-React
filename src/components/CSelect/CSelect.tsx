import { ProFormSelect } from '@ant-design/pro-form';
import { Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { getProductSelectList } from '@/pages/Product/services';
import type { DataItem } from '@/pages/Product/productColumn';
import style from './cselect.less'

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

const CSelect: React.FC<{value?: string;
  onChange?: (
    value: {
      key: string;
      value: string;
      price: number;
      p_name: string;
      ware_house: number;
      label: string;
    },
  ) => void;
}> = ({onChange}) => {
  const [data, setData] = useState<DataItem[]>()
  const [loading, setLoading] = useState(true)
  const [number, setPNumber] = useState('')
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    getProductSelectList(search).then((res) => {
      setData(res.data)
      setLoading(false)
    })
  }, [search])
  return (
    <div className={style.customProductSelect}>
      <ProFormSelect
        placeholder="请选择"
        width="md"
        fieldProps={{
          dropdownRender() {
            return <Table dataSource={data} columns={columns} pagination={false} size="small" loading={loading}
                          onRow={(record) => {
                            return {
                              onClick: () => {
                                onChange?.(record as DataItem)
                                setPNumber(record.value)
                                setOpen(false)
                              }
                            }
                          }}
            />
          },
          dropdownClassName: "select-drop-down",
          optionLabelProp: "value",
          dropdownMatchSelectWidth: 400,
          showArrow: false,
          showSearch: true,
          value: number,
          options:data,
          open:open,
          onFocus: () => {
            setOpen(true)
          },
          onClear:() => {
            setPNumber('')
          },
          onClick: () => {
            setOpen(!open)
          },
          onInputKeyDown() {},
          onSearch: (s) => {
            setSearch(s)
          },
          onMouseLeave: () => {
            console.log("鼠标移除")
          }
        }}
      />
    </div>
  )
}

export default CSelect
