import { ProFormSelect } from '@ant-design/pro-form';
import { Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { getProductSelectList } from '@/pages/Product/services';
import type { DataItem } from '@/pages/Product/productColumn';

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

const CSelect: React.FC<{value?: {
    key: string;
    value: string;
    price: number;
    p_name: string;
    ware_house: number;
    label: string;
  };
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
  // const [column, setColumn] = useState<DataItem>()
  const [number, setPNumber] = useState('')
  const [open, setOpen] = useState(false)
  useEffect(() => {
    getProductSelectList().then((res) => {
      setData(res.data)
      setLoading(false)
    })
  }, [])
  return (
    <div className={'customProductSelect'}>
      <ProFormSelect
        placeholder="请选择"
        width="md"
        fieldProps={{
          dropdownRender() {
            return <Table dataSource={data} columns={columns} pagination={false} size="small" loading={loading}
                          onRow={(record) => {
                            return {
                              onClick: () => {
                                // setColumn(() => {
                                //   return record
                                // })
                                onChange?.(record as DataItem)
                                setPNumber(record.value)
                                setOpen(false)
                              }
                            }
                          }}
            />
          },
          optionLabelProp: "value",
          showArrow: false,
          showSearch: true,
          value: number,
          options:data,
          open:open,
          onFocus: () => {
            setOpen(true)
          },
          onChange: () => {},
          onClear:() => {
            setPNumber('')
          },
          onClick: () => {
            setOpen(!open)
          },
          onInputKeyDown() {console.log("onInputKeyDown")}
        }}
      />
    </div>
  )
}

export default CSelect
