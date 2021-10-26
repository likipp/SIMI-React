import { PageContainer } from '@ant-design/pro-layout';
import ProForm, { ProFormText, ProFormDigit, ProFormSelect, ProFormInstance } from '@ant-design/pro-form';
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import React, { useEffect, useState, useRef } from 'react';
import { message, Button } from 'antd';
import { getCustomList, getProductList } from '@/pages/Product/services';

type DataSourceType = {
  id: React.Key;
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

const columns: ProColumns<DataSourceType>[] = [
  {
    title: '产品代码',
    dataIndex: 'p_number',
    width: '30%',
    valueType: 'select',
    formItemProps: () => {
      return {
        rules: [{required: true, message: "产品名称必填"}]
      }
    },
    renderFormItem:() => {
     return <div style={{marginTop: '24px'}}>
       <ProFormSelect
         name="p_number"
         showSearch
         width={'sm'}
         request={async ({ keyWords }) => {
           return Promise.resolve(getProductList(keyWords)).then((res => {
             return res.data
           })).catch((err) => {
             console.log(err)
           })
         }}
         placeholder="请输入产品代码"
         rules={[{ required: true, message: '产品代码必填' }]}
         onChange={(value: string) => {
           // formRef?.current?.setFieldsValue({name: value})
         }}
         fieldProps={{
           optionItemRender(item) {
             return item.label + ' - ' + item.value;
           },
           showArrow: false
         }}
       />
     </div>
    }
  },
  {
    title: '产品名称',
    dataIndex: 'p_name',
    width: '30%',
    formItemProps: () => {
      return {
        rules: [{required: true, message: "产品名称必填"}]
      }
    }
  },
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
    // renderFormItem:() => {
    //   return  <div style={{marginTop: "24px"}}>
    //     <ProFormDigit
    //       name="input-number"
    //       min={1}
    //       max={100}
    //       fieldProps={{
    //         precision: 2,
    //         formatter: (value: number) => `${value}%`,
    //         parser: (value: string) => value.replace('%', '')
    //       }}
    //     />
    //   </div>
    // }
  },
  {
    title: '数量',
    // valueType: 'option',
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
      total = 0
      return <span>{total.toFixed(2)}</span>
    },
    render: (_, row) => {
      let total: number
      if (row.qty !== undefined && row.unit_price !== undefined && row.discount !== undefined) {
        total = row.qty * row.unit_price * row.discount
        return <span>{total.toFixed(2)}</span>;
      }
      return null
    }
  }
];

export default () => {
  const formRef = useRef<ProFormInstance>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
    defaultData.map((item) => item.id),
  );
  return <PageContainer>
    <ProForm<{
      p_number: string;
      p_name: string,
    }>
      onFinish={async (values) => {
        console.log(values);
        message.success('提交成功');
      }}
      // initialValues={{
      //   dataSource: defaultData
      // }}
      // onValuesChange={(_, values) => {
      //   console.log(values);
      // }}
      formRef={formRef}
    >
      <ProForm.Group>
        <ProFormText width="sm" name="id" label="单据编号" />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          name="c_number"
          label="客户代码"
          showSearch
          width={'sm'}
          request={async ({ keyWords }) => {
            return Promise.resolve(getCustomList(keyWords)).then((res => {
              return res.data
            })).catch((err) => {
              console.log(err)
            })
          }}
          placeholder="请输入客户代码"
          rules={[{ required: true, message: '客户代码必填' }]}
          onChange={(value: string) => {
            formRef?.current?.setFieldsValue({p_name: value})
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
          name="p_name"
          label="客户名称"
          tooltip="最长为 24 位"
          placeholder="请输入名称"
          disabled={true}
        />
        <ProFormDigit
          label="折扣"
          name="input-number"
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
        name="dataSource"
        initialValue={defaultData}
        trigger="onValuesChange"
      >
        <EditableProTable<DataSourceType>
          rowKey="id"
          name="dataSource"
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
  </PageContainer>
}
