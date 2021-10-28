import React, { useRef, useState } from 'react';
import { Form, message, Typography } from 'antd';
import type {
  ProFormInstance} from '@ant-design/pro-form';
import ProForm, {
  ProFormDigit,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-form';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable, { EditableProTable } from '@ant-design/pro-table';
import { getProductList, getCustomList } from '@/pages/Product/services';
import { forEach } from 'lodash';

const { Text } = Typography;

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

let p_number11: string

type DataSourceType = {
  id: React.Key;
  custom: number;
  c_number: number;
  p_number: string;
  p_number2: string;
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
  return Promise.resolve(getProductList(keyWords))
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

const calcAmount = ({ unit_price, from, qty, discount, rowKey }: any) => {
  if (typeof qty === 'number' && typeof unit_price === 'number' && typeof discount === 'number') {
    if (discount > 0) {
      from.setFields([
        {
          name: [`${rowKey}`, 'total'],
          value: (qty * unit_price * discount) / 100,
        },
      ]);
      return;
    }
    from.setFields([
      {
        name: [`${rowKey}`, 'total'],
        value: qty * unit_price,
      },
    ]);
  }
};

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
    key: 'p_number',
    width: '30%',
    valueType: 'select',
    formItemProps: () => {
      return {
        rules: [{ required: true, message: '产品代码必填' }],
      };
    },
    fieldProps:(form, {rowKey}) => {
        return {
          optionItemRender(item: { label: string; value: string }) {
            return item.label + ' - ' + item.value;
          },
          showArrow: false,
          showSearch: true,
          onChange: (value: any, item: any) => {
            if (typeof rowKey === 'number') {
              form.setFieldsValue({[rowKey]: {p_number2: item.label}})
              console.log(form.getFieldValue([rowKey || '', 'p_number2']))
            }
          }
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
        rules: [{ required: true, message: '产品名称必填' }],
      };
    },
    fieldProps: (from, { rowKey }) => {
      if (from) {
        const p_number = from.getFieldValue([rowKey || '', 'p_number']);
        from.setFields([
          {
            name: [`${rowKey}`, 'p_name'],
            value: p_number,
          },
        ]);
      }
      return {
        precision: 2,
        min: 0,
        max: 9999,
      };
    },
  },
  {
    title: '单价',
    dataIndex: 'unit_price',
    valueType: 'money',
    fieldProps: {
      precision: 2,
      min: 0,
      max: 9999,
    },
    formItemProps: () => {
      return {
        rules: [{ required: true, message: '单价必填' }],
      };
    },
  },
  {
    title: '数量',
    dataIndex: 'qty',
    valueType: 'digit',
    fieldProps: {
      precision: 0,
      min: 1,
      max: 9999,
    },
    formItemProps: () => {
      return {
        rules: [{ required: true, message: '数量必填' }],
      };
    },
  },
  {
    title: '产品代码',
    dataIndex: 'p_number2',
    // hideInTable: true,
  },
  {
    title: '折扣',
    dataIndex: 'discount',
    valueType: 'percent',
  },
  {
    title: '总价',
    dataIndex: 'total',
    valueType: 'money',
    // fieldProps: (from, { rowKey }) => {
    //   if (from) {
    //     const unit_price = from.getFieldValue([rowKey || '', 'unit_price']);
    //     const qty = from.getFieldValue([rowKey || '', 'qty']);
    //     const discount = from.getFieldValue([rowKey || '', 'discount']);
    //     calcAmount({ unit_price, from, qty, discount, rowKey });
    //   }
    //   return {
    //     precision: 2,
    //     min: 0,
    //     max: 9999,
    //   };
    // },
    formItemProps: () => {
      return {
        rules: [{ required: true, message: '总价必填' }],
      };
    },
    renderFormItem: (_, {record})  => {
      let t: number
      if (record) {
        if (record.discount > 0) {
          t = record.qty * record.unit_price * record.discount / 100
          return t
        }
        t = record.qty * record.unit_price
        return t
      }
      return 0
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
  const [dataSource, setDataSource] = useState<DataSourceType[]>(() => defaultData);
  const [form] = Form.useForm()

  return (
    <ProForm<{
      name: string;
      company: string;
    }>
      formRef={formRef}
      onFinish={async (values) => {
        await waitTime(2000);
        console.log(values, '提交事件');
        message.success('提交成功');
      }}
      initialValues={{
        useMode: 'chapter',
      }}
    >
      <ProForm.Group>
        <ProFormText width="sm" name="id" label="单据编号" />
        <div style={{ display: 'none' }} />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          name="c_number"
          label="客户代码"
          showSearch
          width={'sm'}
          request={async (keyWords) => {
            return Promise.resolve(getCustomList(keyWords))
              .then((res) => {
                return res.data;
              })
              .catch((err) => {
                console.log(err);
              });
          }}
          placeholder="请输入客户代码"
          rules={[{ required: true, message: '客户代码必填' }]}
          onChange={(value: string, label: any) => {
            formRef?.current?.setFieldsValue({ custom: label.id });
            formRef?.current?.setFieldsValue({ c_name: label.value });
          }}
          fieldProps={{
            optionItemRender(item) {
              return item.label + ' - ' + item.value;
            },
            showArrow: false,
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
            parser: (value: string) => value.replace('%', ''),
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
          value={dataSource}
          onChange={setDataSource}
          recordCreatorProps={{
            newRecordType: 'dataSource',
            position: 'top',
            record: () => ({
              id: Date.now(),
            }),
          }}
          controlled
          editable={{
            type: 'multiple',
            editableKeys,
            form,
            onChange: setEditableRowKeys,
            actionRender: (row, _, dom) => {
              return [dom.save, dom.delete];
            },
            onValuesChange: (record, recordList) => {
              const list = form.getFieldsValue(true)
              // console.log(record, "record")


              if (record) {
                for (const listKey in list) {
                  if (list[listKey].p_name === record.p_name) {
                    record.p_number2 = list[listKey].p_number2
                  }
                }
                  const unit_price = record.unit_price
                  const qty = record.qty
                  const discount = record.discount
                  record.p_name = record.p_number
                // if (form.getFieldsValue(true)[0].p_number2) {
                //   record.p_number2 = form.getFieldsValue(true)[0].p_number2
                // }
                //
                // console.log(record.p_number2, "number2")
                if (discount > 0) {
                  record.total = unit_price * qty * discount / 100
                } else {
                  record.total = unit_price * qty
                }
              }
              console.log(record)
              setDataSource(recordList);
            },
          }}
          summary={(pageData) => {
            let totalNum = 0;
            let totalSum = 0;
            pageData.forEach(({ total, qty }) => {
              if (qty) totalNum += qty;
              if (total) totalSum += total;
            });

            return (
              <>
                <ProTable.Summary.Row>
                  <ProTable.Summary.Cell index={3} colSpan={2}>
                    <Text strong style={{ fontSize: '20px' }}>
                      合计:
                    </Text>
                  </ProTable.Summary.Cell>
                  <ProTable.Summary.Cell align={'right'} index={1} colSpan={3}>
                    <Text strong style={{ fontSize: '20px' }}>
                      总数：{totalNum}
                    </Text>
                  </ProTable.Summary.Cell>
                  <ProTable.Summary.Cell index={2} align={'right'} colSpan={2}>
                    <Text strong style={{ fontSize: '20px' }}>
                      总额：{totalSum}
                    </Text>
                  </ProTable.Summary.Cell>
                </ProTable.Summary.Row>
              </>
            );
          }}
        />
      </ProForm.Item>
    </ProForm>
  );
};
