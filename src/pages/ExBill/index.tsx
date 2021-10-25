import { PageContainer } from '@ant-design/pro-layout';
import ProForm, { ProFormText, ProFormDigit, ProFormSelect } from '@ant-design/pro-form';
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import React, { useEffect, useState } from 'react';
import {  message } from 'antd';
import DebounceSelect from '@/pages/ExBill/DebountceSelect';
import { getProductList } from '@/pages/Product/services';
// import TagList from '@/pages/Custom/CreateOrder/tagList';

const waitTime1 = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

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
    formItemProps: () => {
      return {
        rules: [{required: true, message: "产品名称必填"}]
      }
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
    renderFormItem:() => {
      return  <ProFormDigit
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
    }
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
    renderFormItem: (_, {record}) => {
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
  const [, setData] = useState([])
  const [value, setValue] = React.useState([]);
  useEffect(() => {
    getProductList().then((res) => {
      setData(res.data)
    })
  }, [])
  return <PageContainer>
    <ProForm<{
      name: string;
      company: string;
    }>
      onFinish={async (values) => {
        await waitTime1(2000);
        console.log(values);
        message.success('提交成功');
      }}
      initialValues={{
        name: '蚂蚁设计有限公司',
        useMode: 'chapter',
      }}
    >
      <ProForm.Group>
        <ProFormText width="sm" name="id" label="单据编号" />
        <DebounceSelect mode="multiple"
                        value={value}
                        placeholder="Select users"
                        style={{ width: '100%' }}
                        fetchOptions={getProductList}
                        onChange={newValue => {
                          setValue(newValue);
                        }}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          width="sm"
          options={[
            {
              value: 'time',
              label: '履行完终止',
            },
          ]}
          name="unusedMode"
          label="客户代码"
        />
        <ProFormText
          width="md"
          name="name"
          label="客户名称"
          tooltip="最长为 24 位"
          placeholder="请输入名称"
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
          // formatter={(value: number) => `${value}%`}
          // parser={(value: string) => value.replace('%', '')}
        />
      </ProForm.Group>
      <ProForm.Item
        label="订单明细"
        name="dataSource"
        initialValue={defaultData}
        // trigger="onValuesChange"
      >
        <EditableProTable<DataSourceType>
          rowKey="id"
          toolBarRender={false}
          columns={columns}
          recordCreatorProps={{
            newRecordType: 'dataSource',
            position: 'bottom',
            record: () => ({
              id: Date.now(),
              // total: record.price * record.number * record.discount
            }),
          }}
          editable={{
            type: 'multiple',
            // editableKeys,
            // onChange: setEditableRowKeys,
            actionRender: (row, _, dom) => {
              return [dom.delete];
            },
          }}
        />
      </ProForm.Item>
    </ProForm>
  </PageContainer>
}
