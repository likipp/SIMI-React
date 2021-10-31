import type { MutableRefObject } from 'react';
import React, { useRef, useState } from 'react';
import { Button, Form, message } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ProFormDatePicker, ProFormRadio } from '@ant-design/pro-form';
import ProForm, { ProFormDigit, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import {
  getProductList,
  getCustomList,
  getWareHouseList,
  createExBill,
} from '@/pages/Product/services';
import moment from 'moment';
import { PageContainer } from '@ant-design/pro-layout';
import summary from '@/utils/summary';
import type { DataSourceType } from '@/pages/ExBillDetail/data';

// type DataSourceType = {
//   id: React.Key;
//   custom: number;
//   type: string;
//   c_number: number;
//   pay_method: string;
//   p_number: string;
//   p_number2: string;
//   p_name: string;
//   unit_price: number;
//   ware_house: number,
//   discount: number;
//   ex_qty: number;
//   total: number;
//   created_at?: string;
//   body: DataSourceType[];
// };

const defaultData: DataSourceType[] = [];

const requestProduct = async (keyWords: any) => {
  return Promise.resolve(getProductList(keyWords)).then((res) => {
    return res.data;
  });
};

const requestWareHouse = async (keyWords: any) => {
  return Promise.resolve(getWareHouseList(keyWords)).then((res) => {
    return res.data;
  });
};

// const calcAmount = ({ unit_price, from, ex_qty, discount, rowKey }: any) => {
//   if (typeof ex_qty === 'number' && typeof unit_price === 'number' && typeof discount === 'number') {
//     if (discount > 0) {
//       from.setFields([
//         {
//           name: [`${rowKey}`, 'total'],
//           value: (ex_qty * unit_price * discount) / 100,
//         },
//       ]);
//       return;
//     }
//     from.setFields([
//       {
//         name: [`${rowKey}`, 'total'],
//         value: ex_qty * unit_price,
//       },
//     ]);
//   }
// };

const columns: ProColumns<DataSourceType>[] = [
  {
    title: '序号',
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '产品代码',
    align: 'right',
    dataIndex: 'p_number',
    key: 'p_number',
    width: '10%',
    valueType: 'select',
    formItemProps: () => {
      return {
        rules: [{ required: true, message: '产品代码必填' }],
      };
    },
    fieldProps: (form, { rowKey }) => {
      return {
        optionItemRender(item: { label: string; value: string }) {
          return item.label + ' - ' + item.value;
        },
        showArrow: false,
        showSearch: true,
        onChange: (value: any, item: any) => {
          form.setFieldsValue({ [rowKey as any]: { p_number2: item.label } });
          // if (typeof rowKey === 'number') {
          //   // console.log(form.getFieldValue([rowKey || '', 'p_number2']))
          // }
        },
      };
    },
    request: requestProduct,
  },
  {
    title: '产品名称',
    align: 'right',
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
    align: 'right',
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
    align: 'right',
    dataIndex: 'ware_house',
    valueType: 'select',
    formItemProps: () => {
      return {
        rules: [{ required: true, message: '仓库必填' }],
      };
    },
    fieldProps: {
      showArrow: false,
      showSearch: true,
    },
    request: requestWareHouse,
  },
  {
    title: '数量',
    align: 'right',
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
    align: 'right',
    dataIndex: 'p_number2',
    hideInTable: true,
  },
  {
    title: '折扣',
    align: 'right',
    dataIndex: 'discount',
    valueType: 'percent',
    fieldProps: {
      precision: 2,
      min: 0,
      max: 100,
    },
  },
  {
    title: '总价',
    align: 'right',
    dataIndex: 'total',
    valueType: 'money',
    formItemProps: () => {
      return {
        rules: [{ required: true, message: '总价必填' }],
      };
    },
    // renderFormItem: (_, {record})  => {
    //   // let t: number
    //   if (record) {
    //     if (record.unit_price === undefined || record.ex_qty === undefined) {
    //       return 0
    //     }
    //     if (record.discount > 0) {
    //       record.total = record.ex_qty * record.unit_price * record.discount / 100
    //       return record.total
    //     }
    //     record.total = record.ex_qty * record.unit_price
    //     return record.total
    //   }
    //   return 0
    // }
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
  const [form] = Form.useForm();

  return (
    <PageContainer>
      <ProForm<DataSourceType>
        formRef={formRef as MutableRefObject<any>}
        onFinish={async (values) => {
          const result: DataSourceType = values;
          result.type = '出库单';
          // delete result.c_name
          result.c_number = 0;
          for (const i of result.body) {
            i.p_number = i.p_number2;
            i.p_number2 = '';
            i.id = 0;
            i.ware_house = parseInt(String(i.ware_house));
          }
          console.log(values, 'values');
          createExBill(result).then(() => {
            message.success('单据创建成功');
            form.resetFields();
          });
        }}
        submitter={{
          searchConfig: {
            resetText: '重置',
            submitText: '保存',
          },
          render: (props) => {
            return [
              <Button
                type="dashed"
                key="rest"
                danger
                onClick={() => {
                  props.form?.resetFields();
                  form.resetFields();
                  setDataSource([]);
                }}
              >
                重置
              </Button>,
              <Button type="primary" key="submit" onClick={() => props.form?.submit?.()}>
                提交
              </Button>,
            ];
          },
        }}
        // onValuesChange={(value, allValue) => {
        //   console.log(value)
        //   console.log(allValue)
        //   console.log(form.getFieldsValue(true), "form")
        //   console.log(formRef.current?.getFieldsValue(true), "formRef")
        // }}
        // initialValues={{
        //   useMode: 'chapter',
        // }}
      >
        <ProForm.Group>
          <ProFormText width="sm" name="id" label="单据编号" />
          <ProFormDatePicker
            name="created_at"
            label="单据日期"
            initialValue={moment(new Date().getTime()).format('YYYY-MM-DD')}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormSelect
            name="c_number"
            label="客户代码"
            showSearch
            width={'sm'}
            request={async (keyWords) => {
              return Promise.resolve(getCustomList(keyWords)).then((res) => {
                return res.data;
              });
            }}
            placeholder="请输入客户代码"
            rules={[{ required: true, message: '客户代码必填' }]}
            onChange={(value: string, label: any) => {
              formRef?.current?.setFieldsValue({ custom: label.id });
              formRef?.current?.setFieldsValue({ c_name: label.value });
              formRef?.current?.setFieldsValue({ discount: label.discount });
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
              formatter: (value: any) => `${value}%`,
              parser: (value: any) => value.replace('%', ''),
            }}
            // onChange={(value: number) => {
            //   formRef?.current?.setFieldsValue({ discount: value });
            // }}
          />
          <ProFormRadio.Group
            name="pay_method"
            label="付款方式"
            options={[
              {
                label: '支付宝',
                value: 'ali',
              },
              {
                label: '微信',
                value: 'wechat',
              },
            ]}
            rules={[{ required: true, message: '付款方式必填' }]}
          />
        </ProForm.Group>
        <ProForm.Item name="body" initialValue={defaultData} trigger="onValuesChange">
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
                const list = form.getFieldsValue(true);
                if (record) {
                  const unit_price = record.unit_price;
                  const ex_qty = record.ex_qty;
                  const discount = record.discount;
                  const c_discount = formRef.current?.getFieldsValue(true).discount;
                  for (const listKey in list) {
                    if (list[listKey].p_name === record.p_name) {
                      record.p_number2 = list[listKey].p_number2;
                      if (c_discount > 0) {
                        const total = (unit_price * ex_qty * c_discount) / 100;
                        if (discount > 0) {
                          form.setFieldsValue({ [listKey]: { total: (total * discount) / 100 } });
                        } else {
                          form.setFieldsValue({ [listKey]: { total: total } });
                        }
                      } else {
                        if (discount > 0) {
                          form.setFieldsValue({
                            [listKey]: { total: (unit_price * ex_qty * discount) / 100 },
                          });
                        } else {
                          form.setFieldsValue({ [listKey]: { total: unit_price * ex_qty } });
                        }
                      }
                      // if (discount > 0) {
                      //   form.setFieldsValue({[listKey]: {total: unit_price * ex_qty * discount / 100}})
                      //   // record.total = unit_price * ex_qty * discount / 100
                      // } else {
                      //   form.setFieldsValue({[listKey]: {total: unit_price * ex_qty}})
                      //   // record.total = unit_price * ex_qty
                      // }
                    }
                  }
                  record.p_name = record.p_number;
                }
                setDataSource(recordList);
              },
            }}
            summary={(pageData) => summary(pageData)}
          />
        </ProForm.Item>
      </ProForm>
    </PageContainer>
  );
};
