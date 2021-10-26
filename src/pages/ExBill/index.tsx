import React, { useRef, useState } from 'react';
import { message } from 'antd';
import ProForm, { ProFormDigit, ProFormInstance, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import { getProductList, getCustomList } from '@/pages/Product/services';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

type DataSourceType = {
  id: React.Key;
  custom: number;
  c_number: number;
  p_number: string;
  p_name: string;
  unit_price: number;
  discount: number;
  qty: number;
  total: number;
  created_at?: string;
  children?: DataSourceType[];
};

const defaultData: DataSourceType[] = [];

const request = async (keyWords: any) => {
  console.log(keyWords, "params")
  return Promise.resolve(getProductList(keyWords)).then((res => {
              console.log(res.data, "产品信息");
      return res.data
    })).catch((err) => {
      console.log(err)
    })
}

let p_number = ''

const columns: ProColumns<DataSourceType>[] = [
  {
    title: '产品代码',
    dataIndex: 'p_number',
    key:'p_number',
    width: '30%',
    valueType: 'select',
    formItemProps: () => {
      return {
        rules: [{required: true, message: "产品代码必填"}]
      }
    },
    fieldProps:{
      optionItemRender(item: { label: string; value: string; }) {
        return item.label + ' - ' + item.value;
      },
      showArrow: false,
      showSearch: true,
      onChange: (value, item) => {
        console.log(item)
        // p_number = item.label;
        // console.log(p_number, "p_number")
      }
    },
    request: request,

  },
  {
    title: '产品名称',
    dataIndex: 'p_name',
    width: '30%',
    formItemProps: () => {
      return {
        rules: [{required: true, message: "产品名称必填"}]
      }
    },
    renderFormItem: (_, {record})  => {
      return <span>{record?.p_number}</span>
    }
  },
  // {
  //   title: '产品',
  //   dataIndex: 'p_number',
  //   formItemProps: () => {
  //     return {
  //       rules: [{required: true, message: "产品代码必填"}]
  //     }
  //   },
  //   renderFormItem: (_, {record})  => {
  //     return <span>{p_number}</span>
  //   },
  //   hideInTable: true
  // },
  {
    title: '单价',
    dataIndex: 'unit_price',
    valueType: 'money',
    formItemProps: () => {
      return {
        rules: [{required: true, message: "单价必填"}]
      }
    }
  },
  {
    title: '折扣',
    dataIndex: 'discount',
    valueType: 'percent',
  },
  {
    title: '数量',
    dataIndex: 'qty',
    valueType: 'digit',
    formItemProps: () => {
      return {
        rules: [{required: true, message: "数量必填"}]
      }
    }
  },
  {
    title: '总价',
    dataIndex: 'total',
    valueType: 'money',
    formItemProps: () => {
      return {
        rules: [{required: true, message: "总价必填"}]
      }
    },
    renderFormItem: (_, { record}) => {
      let total: number
      if (record && record.discount > 0) {
        total = record.unit_price * record.qty * (record.discount / 100)
        return <span>{total.toFixed(2)}</span>
      } else if (record && record.discount == null) {
        total = record.unit_price * record.qty
        return <span>{total.toFixed(2)}</span>
      }
      return null
    },
    render: (_, row) => {
      let total: number
      if (row.qty !== undefined && row.unit_price !== undefined && row.discount !== undefined) {
        total = row.qty * row.unit_price * row.discount
        return <span>{total.toFixed(2)}</span>;
      }
      return null
    }
  },
  {
    title: '操作',
    valueType: 'option',
  },
];

export default () => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
    defaultData.map((item) => item.id),
  );
  const formRef = useRef<ProFormInstance>();

  return (
    <ProForm<{
      name: string;
      company: string;
    }>
      formRef={formRef}
      onFinish={async (values) => {
    await waitTime(2000);
    console.log(values);
    message.success('提交成功');
  }}
  initialValues={{
      useMode: 'chapter',
  }}
>
      <ProForm.Group>
        <ProFormText width="sm" name="id" label="单据编号" />
        <div style={{display: 'none'}}><ProFormText width="sm" name="custom" label="客户ID"/></div>
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          name="c_number"
          label="客户代码"
          showSearch
          width={'sm'}
          request={async (keyWords) => {
            return Promise.resolve(getCustomList(keyWords)).then((res => {
              console.log(res, "res")
              return res.data
            })).catch((err) => {
              console.log(err)
            })
          }}
          placeholder="请输入客户代码"
          rules={[{ required: true, message: '客户代码必填' }]}
          onChange={(value: string, label: any) => {
            formRef?.current?.setFieldsValue({custom: label.id})
            formRef?.current?.setFieldsValue({c_name: label.value})
          }}
          fieldProps={{
            optionItemRender(item) {
              return item.label + ' - ' + item.value;
            },
            showArrow: false
          }}
        />
        <ProFormText
          width="md"
          name="c_name"
          label="客户名称"
          tooltip="最长为 24 位"
          placeholder="请输入名称"
          disabled={true}
        />
        <ProFormDigit
          label="折扣"
          name="discount"
          min={1}
          max={100}
          fieldProps={{
            precision: 2,
            formatter: (value: number) => `${value}%`,
            parser: (value: string) => value.replace('%', '')
          }}
        />
      </ProForm.Group>
  <ProForm.Item
    label="数组数据"
  name="body"
  initialValue={defaultData}
  trigger="onValuesChange"
  >
  <EditableProTable<DataSourceType>
    rowKey="id"
    toolBarRender={false}
    columns={columns}
    recordCreatorProps={{
      newRecordType: 'dataSource',
        position: 'top',
        record: () => ({
          id: Date.now(),
      }),
    }}
  editable={{
      type: 'multiple',
      editableKeys,
      onChange: setEditableRowKeys,
      actionRender: (row, _, dom) => {
      return [dom.delete];
    },
  }}
  />
  </ProForm.Item>
  </ProForm>
);
};
