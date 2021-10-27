import React, { useRef, useState } from 'react';
import { Form, message } from 'antd';
import type { ProFormInstance} from '@ant-design/pro-form';
import ProForm, { ProFormDigit, ProFormSelect, ProFormText } from '@ant-design/pro-form';
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
  return Promise.resolve(getProductList(keyWords)).then((res => {
      return res.data
    })).catch((err) => {
      console.log(err)
    })
}

const columns: ProColumns<DataSourceType>[] = [
  {
    title: '排序',
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
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
    fieldProps: (form, {rowKey}) => {
      const p_number = form.getFieldValue([rowKey || '', 'p_number'])
      if (p_number != "") {
        form.setFieldsValue({[rowKey]: {p_name: p_number}})
      }
    }
  },
  {
    title: '单价',
    dataIndex: 'unit_price',
    valueType: 'money',
    fieldProps: {
      precision: 2,
      min: 0,
      max: 9999
    },
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
    fieldProps: {
      precision: 0,
      min: 1,
      max: 9999
    },
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
    fieldProps: {
      precision: 2,
      min: 0,
      max: 9999
    },
    formItemProps: () => {
      return {
        rules: [{required: true, message: "总价必填"}]
      }
    },
    fieldProps: (form, {rowKey}) => {
      if (form) {
        // console.log(form.getFieldValue([rowKey || '', 'discount']), "折扣")
        const discount = form.getFieldValue([rowKey || '', 'discount'])
        const qty = form.getFieldValue([rowKey || '', 'qty'])
        const unit_price = form.getFieldValue([rowKey || '', 'unit_price'])

        if (form && discount > 0 && qty > 0 && unit_price > 0) {
          form.setFieldsValue({[rowKey]: {total: discount * qty * unit_price}})
          console.log("折扣成功了")
        }
        if (discount <= 0 && qty > 0 && unit_price > 0) {
          form.setFieldsValue({[rowKey]: {total: qty * unit_price}})
        }
      }

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
  const [form] = Form.useForm();
  const formRef = useRef<ProFormInstance>();
  const [dataSource, setDataSource] = useState<DataSourceType[]>([]);
  const [formData, setFormData] = useState<DataSourceType[]>([])

  return (
    <ProForm
      formRef={formRef}
      onFinish={async (values) => {
    await waitTime(2000);
    // console.log(formRef.current?.getFieldsValue(true), "formRef")
    console.log(values, "提交事件");
    console.log(formData, "formData")
    message.success('提交成功');
  }}
  // initialValues={{
  //     useMode: 'chapter',
  // }}
>
      <ProForm.Group>
        <ProFormText width="sm" name="id" label="单据编号" />
        <div style={{display: 'none'}} />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          name="c_number"
          label="客户代码"
          showSearch
          width={'sm'}
          request={async (keyWords) => {
            return Promise.resolve(getCustomList(keyWords)).then((res => {
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
  // initialValue={defaultData}
  // trigger="onValuesChange"
  >
  <EditableProTable<DataSourceType>
    rowKey="id"
    toolBarRender={false}
    bordered={true}
    columns={columns}
    value={dataSource}
    onChange={setDataSource}
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
      form,
      onValuesChange: (record, recordList) => {
        console.log(form.getFieldsValue(true), "form")
        // console.log(recordList, "recordList")
        // Object.values(form.getFieldsValue(true))
        setDataSource(recordList);
        // setFormData(form.getFieldsValue(true))
      },
      actionRender: (row, _, dom) => {
      return [dom.delete];
    },
  }}
  />
  </ProForm.Item>
  </ProForm>
);
};
