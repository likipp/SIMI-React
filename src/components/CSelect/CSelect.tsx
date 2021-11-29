import { ProFormSelect } from '@ant-design/pro-form';
import { Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { getProductSelectList } from '@/pages/Product/services';
import type { DataItem } from '@/pages/Product/productColumn';
import style from './cselect.less'

const CSelect: React.FC<{value?: {
    key: string;
    label: string
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
}> = ({value, onChange}) => {
  const [data, setData] = useState<DataItem[]>()
  const [loading, setLoading] = useState(true)
  const [, setPNumber] = useState('')

  useEffect(() => {
    getProductSelectList().then((res) => {
      setData(res.data)
      setLoading(false)
    })
  }, [])
  return (
    <div className={style.customProductSelect}>
      <ProFormSelect
        placeholder="请选择"
        width="md"
        fieldProps={{
          optionItemRender(item: DataItem) {
            return (
              <>
                <Row align={'middle'} className={style.selectTDBorder}>
                  <Col span={12}>{item.value}</Col>
                  <Col span={12}>{item.p_name}</Col>
                </Row>
              </>
            )
          },
          dropdownRender(menu) {
            return (
              <>
                <Row align={'middle'} className={style.selectTH}>
                  <Col span={12}>产品代码</Col>
                  <Col span={12}>产品名称</Col>
                </Row>
                <div>{menu}</div>
              </>
            )
          },
          dropdownClassName: "select-drop-down",
          optionLabelProp: "value",
          dropdownMatchSelectWidth: 500,
          showArrow: false,
          showSearch: true,
          options:data,
          loading: loading,
          onClear:() => {
            setPNumber('')
          },
          onChange: (v: any, item: any) => {
            onChange?.(item as DataItem)
            // value = item.p_number
          }
        }}
      />
    </div>
  )
}

export default CSelect
