import React, { useRef, useState } from 'react';
import { Button, Form, message, Typography } from 'antd';
import {
  ProFormInstance, ProFormRadio} from '@ant-design/pro-form';
import ProForm, {
  ProFormDigit,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-form';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable, { EditableProTable } from '@ant-design/pro-table';
import { getProductList, getCustomList, getWareHouseList, createExBill } from '@/pages/Product/services';

const { Text } = Typography;

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
  type: string;
  c_number: number;
  pay_method: string;
  p_number: string;
  p_number2: string;
  p_name: string;
  unit_price: number;
  ware_house: number,
  discount: number;
  ex_qty: number;
  total: number;
  created_at?: string;
  children?: DataSourceType[];
};

const defaultData: DataSourceType[] = [];

const requestProduct = async (keyWords: any) => {
  return Promise.resolve(getProductList(keyWords))
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

const requestWareHouse = async (keyWords: any) => {
  return Promise.resolve(getWareHouseList(keyWords))
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

const calcAmount = ({ unit_price, from, ex_qty, discount, rowKey }: any) => {
  if (typeof ex_qty === 'number' && typeof unit_price === 'number' && typeof discount === 'number') {
    if (discount > 0) {
      from.setFields([
        {
          name: [`${rowKey}`, 'total'],
          value: (ex_qty * unit_price * discount) / 100,
        },
      ]);
      return;
    }
    from.setFields([
      {
        name: [`${rowKey}`, 'total'],
        value: ex_qty * unit_price,
      },
    ]);
  }
};

const columns: ProColumns<DataSourceType>[] = [
  {
    title: '序号',
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '产品代码',
    dataIndex: 'p_number',
    key: 'p_number',
    width: '10%',
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
              // console.log(form.getFieldValue([rowKey || '', 'p_number2']))
            }
          }
        }
      },
    request: requestProduct,
  },
  {
    title: '产品名称',
    dataIndex: 'p_name',
    width: '20%',
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
    title: '仓库',
    dataIndex: 'ware_house',
    valueType: 'select',
    formItemProps: () => {
      return {
        rules: [{ required: true, message: '仓库必填' }],
      };
    },
    fieldProps:{
      showArrow: false,
      showSearch: true

    },
    request: requestWareHouse,
  },
  {
    title: '数量',
    dataIndex: 'ex_qty',
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
    hideInTable: true,
  },
  {
    title: '折扣',
    dataIndex: 'discount',
    valueType: 'percent',
    fieldProps: {
      precision: 2,
      min: 0,
      max: 100,
    }
  },
  {
    title: '总价',
    dataIndex: 'total',
    valueType: 'money',
    formItemProps: () => {
      return {
        rules: [{ required: true, message: '总价必填' }],
      };
    },
    renderFormItem: (_, {record})  => {
      // let t: number
      if (record) {
        if (record.unit_price === undefined || record.ex_qty === undefined) {
          return 0
        }
        if (record.discount > 0) {
          record.total = record.ex_qty * record.unit_price * record.discount / 100
          return record.total
        }
        record.total = record.ex_qty * record.unit_price
        return record.total
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
        const result: DataSourceType = values
        result.type = '出库单'
        // delete result.c_name
        delete result.c_number
        for (const i of result.body) {
          i.p_number = i.p_number2
          delete i.p_number2
          delete i.id
          i.ware_house = parseInt(i.ware_house)
        }
        console.log(values, "values")
        // createExBill(result).then(() => {
        //   message.success("单据创建成功")
        //   form.resetFields()
        // })
      }}
      submitter={{
        searchConfig: {
          resetText: '重置',
          submitText: '保存'
        },
        render:(props) => {
          return [
            <Button type="dashed" key="rest" danger onClick={() => {
              props.form?.resetFields()
              // console.log(form.getFieldsValue(true), "重置")
              // form.resetFields([1635485311159])
              form.resetFields();
            }}>
              重置
            </Button>,
            <Button type="primary" key="submit" onClick={() => props.form?.submit?.()}>
              提交
            </Button>,
          ]
        }
      }}
      // initialValues={{
      //   useMode: 'chapter',
      // }}
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
        <ProFormText
          width="md"
          name="custom"
          label="客户名称"
          tooltip="最长为 24 位"
          placeholder="请输入名称"
          disabled={true}
          hidden={true}
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
        <ProFormRadio.Group
          name="pay_method"
          label="付款方式"
          options={[
            {
              label: '支付宝',
              value: '支付宝',
            },
            {
              label: '微信',
              value: '微信',
            }
          ]}
          rules={[{ required: true, message: '付款方式必填' }]}
        />
      </ProForm.Group>
      <ProForm.Item
        // label="数组数据"
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
            position: 'bottom',
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
              return [dom.delete];
            },
            onValuesChange: (record, recordList) => {
              const list = form.getFieldsValue(true)
              // console.log(formRef.current?.getFieldsValue(true), "总表")
              if (record) {
                const unit_price = record.unit_price
                const ex_qty = record.ex_qty
                const discount = record.discount
                for (const listKey in list) {
                  if (list[listKey].p_name === record.p_name) {
                    record.p_number2 = list[listKey].p_number2
                    // record.total = unit_price * ex_qty * discount / 100
                    if (discount > 0) {
                      form.setFieldsValue({[listKey]: {total: unit_price * ex_qty * discount / 100}})
                      record.total = unit_price * ex_qty * discount / 100
                    } else {
                      form.setFieldsValue({[listKey]: {total: unit_price * ex_qty}})
                      record.total = unit_price * ex_qty
                    }
                  }
                }
                  record.p_name = record.p_number
                  // record.total = record.ex_qty * record.unit_price * record.discount
                // if (discount > 0) {
                //   record.total = unit_price * ex_qty * discount / 100
                // } else {
                //   record.total = unit_price * ex_qty
                // }
              }
              setDataSource(recordList);
            },
          }}
          summary={(pageData) => {
            let totalNum = 0;
            let totalSum = 0;
            pageData.forEach(({ total, ex_qty }) => {
              if (ex_qty) totalNum += ex_qty;
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
