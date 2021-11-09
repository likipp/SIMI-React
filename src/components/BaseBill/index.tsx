import type { MutableRefObject } from 'react';
import React, { useRef, useState } from 'react';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm, {ProFormDatePicker, ProFormRadio, ProFormSelect, ProFormText} from '@ant-design/pro-form';
import type {ExSourceType, InSourceType} from '@/pages/ExBillDetail/data';
import { Button, Form, message, Tooltip } from 'antd';
import {createExBill, getCustomQueryList} from '@/pages/Product/services';
import moment from 'moment';
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import summary from '@/utils/summary';
import { getBillNumber } from '@/pages/InBill/services';
import toDecimal2 from '@/utils/toDecimal2';
import CopyButton from '@/components/CopyButton';

interface BillProps {
  bill: string;
  realDiscount: number
  columns: ProColumns<InSourceType | ExSourceType>[];
}

const defaultData: InSourceType[] = [];

const BaseBill: React.FC<BillProps> = (prop) => {
  const { bill, columns, realDiscount } = prop;
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
    defaultData.map((item) => item.id),
  );
  const formRef = useRef<ProFormInstance>();
  const [dataSource, setDataSource] = useState<InSourceType[]>(() => defaultData);
  const [form] = Form.useForm();
  const [billNumber, setBillNumber] = useState("");

  const requestBillNumber = async () => {
    return Promise.resolve(getBillNumber({ type: bill })).then((res) => {
      setBillNumber(res.data);
      return { bill_number: res.data };
    });
  };

const discountChange = (record: any, recordList: any, type: string) => {
    const list = form.getFieldsValue(true);
    let qty = 0
    if (record) {
      if (type == '出库单') {
        qty = record.ex_qty;
        const unit_price = record.unit_price;
        const in_discount = record.in_discount;
        const ex_discount = record.ex_discount;
        for (const listKey in list) {
          if (list[listKey].p_name === record.p_name) {
            record.p_number2 = list[listKey].p_number2;
            const total: number = toDecimal2((unit_price * qty * ex_discount) / 100);
            const cost: number = toDecimal2((unit_price * qty * in_discount) / 100);
            const profit = toDecimal2(total - cost)
            form.setFieldsValue({
              [listKey]: { total: total },
            });
            form.setFieldsValue({
              [listKey]: { cost: cost },
            });
            form.setFieldsValue({
              [listKey]: { profit: profit },
            });
          }
        }
      } else {
        qty = record.in_qty;
        for (const listKey in list) {
          const unit_price = record.unit_price;
          if (list[listKey].p_name === record.p_name) {
            record.p_number2 = list[listKey].p_number2;
            const total: number = toDecimal2(unit_price * qty);
            form.setFieldsValue({
              [listKey]: { total: total },
            });
          }
        }
      }
      record.p_name = record.p_number;
    }
  }

  return (
    <div>
      <ProForm<InSourceType | ExSourceType>
        formRef={formRef as MutableRefObject<any>}
        onFinish={async (values) => {
          const result: InSourceType | ExSourceType = values;
          result.bill_type = bill;
          result.bill_number = billNumber;
          // delete result.c_name
          for (const i of result.body) {
            i.p_number = i.p_number2;
            i.p_number2 = '';
            i.id = 0;
            i.ware_house = parseInt(String(i.ware_house));
          }
          createExBill(result).then(() => {
            message.success('单据创建成功');
            form.resetFields();
            setDataSource([]);
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
        request={requestBillNumber}
      >
        <ProForm.Group>
          <ProFormText width="sm" name="bill_number" label="单据编号" disabled={true} />
          <ProFormDatePicker
            name="created_at"
            label="单据日期"
            initialValue={moment(new Date().getTime()).format('YYYY-MM-DD')}
          />
          {
            bill == '出库单' ? <ProFormRadio.Group
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
              rules={[{ required: true, message: '付款方式必填' }]} />
              : <></>

          }
        </ProForm.Group>
        {
          bill == '出库单' ? <ProForm.Group>
            <ProFormSelect
              name="c_number"
              label="客户代码"
              showSearch
              width={'sm'}
              request={async (keyWords) => {
                return Promise.resolve(getCustomQueryList(keyWords)).then((res) => {
                  return res.data;
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
            {
              realDiscount ? <CopyButton realDiscount={realDiscount}/> : <></>
            }
          </ProForm.Group>
            : <></>}

        <ProForm.Item name="body" initialValue={defaultData} trigger="onValuesChange">
          <EditableProTable<InSourceType>
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
                discountChange(record, recordList, bill)
                setDataSource(recordList);
              },
            }}
            summary={(pageData) => summary(pageData, bill)}
          />
        </ProForm.Item>
      </ProForm>
    </div>
  );
};

export default BaseBill;
