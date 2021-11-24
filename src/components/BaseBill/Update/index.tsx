import type { MutableRefObject } from 'react';
import React, { useContext, useEffect, useState } from 'react';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm, { ProFormDatePicker, ProFormRadio, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import type { ExSourceType, InSourceType } from '@/pages/ExBillDetail/data';
import { Button, Form, message } from 'antd';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import summary from '@/utils/summary';
import toDecimal2 from '@/utils/toDecimal2';
import { BillContext } from '@/context/billChange';
import calculateEx from '@/components/BaseBill/calculate';
import type { ExBodyType, InBodyType } from '@/pages/ExBillDetail/data';
import { getCustomQueryList, updateExBill } from '@/pages/Product/services';
// import CopyButton from '@/components/CopyButton';

interface BillProps {
  bill: string;
  data: InSourceType | ExSourceType;
  columns: ProColumns<ExBodyType | InBodyType>[];
  actionRef: React.MutableRefObject<ActionType | undefined> ;
  formRef: React.MutableRefObject<ProFormInstance | undefined>
}

const BillUpdate: React.FC<BillProps> = (prop) => {
  const defaultData: (InBodyType | ExBodyType)[] = [];
  const { bill, columns, data, actionRef, formRef} = prop;
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
    defaultData.map((item) => item.id),
  );
  const {dispatch} = useContext(BillContext)
  const [dataSource, setDataSource] = useState<(InBodyType | ExBodyType)[]>(() => defaultData);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false)

  const discountChange = (record: any, recordList: any, type: string) => {
    const list = form.getFieldsValue(true);
    let qty = 0;
    if (record != undefined) {
      if (type == '出库单') {
        for (const listKey in list) {
          const {total, cost, profit} =  calculateEx(qty, list, listKey)
          // record.total = total
          record.cost = cost
          record.profit = profit
          record.total = total
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
      } else {
        for (const listKey in list) {
          let in_discount = list[listKey].in_discount;
          if (in_discount == undefined) {
            in_discount = 100;
          }
          qty = list[listKey].in_qty;
          record.p_number2 = list[listKey].p_number2;
          const unit_price = list[listKey].unit_price;
          const total: number = toDecimal2((unit_price * qty * in_discount) / 100);
          list[listKey].total = total;
          record.total = total
        }
      }
      return;
    }
  };

  useEffect(() => {
    data.body.map((item) => item.ware_house.toString())
    for (let i = 0; i < data.body.length; i++) {
      data.body[i].ware_house = data.body[i].ware_house.toString()
      actionRef.current?.startEditable(data.body[i].id)
    }
    setDataSource(data.body)

  }, [])

  return (
    data ? <div>
      <ProForm<InSourceType | ExSourceType>
        formRef={formRef as MutableRefObject<any>}
        onFinish={async (values) => {
          setLoading(true)
          const result: InSourceType | ExSourceType = values;
          console.log(result, "结果")
          for (const i of result.body) {
            // i.id = 0
            i.ware_house = parseInt(String(i.ware_house));
          }
          // history.push("/stock-table/in")
          updateExBill(result).then((res) => {
            message.success(res.errorMessage, 15);
          }).catch((err) => {
            console.log(err)
          })
          setLoading(false)
          // return true
        }}
        submitter={{
          searchConfig: {
            resetText: '取消',
            submitText: '保存',
          },
          render: (props) => {
            return [
              <Button
                type="dashed"
                key="rest"
                danger
                onClick={() => {
                  dispatch(false)
                }}
              >
                取消
              </Button>,
              <Button type="primary" key="submit" onClick={() => props.form?.submit?.()} loading={loading}>
                提交
              </Button>,
            ];
          },
        }}
      >
        <ProForm.Group>
          <ProFormText
            width="sm"
            name="bill_number"
            label="单据编号"
            disabled={true}
            initialValue={data.bill_number}
          />
          <ProFormDatePicker
            name="created_at"
            label="单据日期"
            disabled={true}
            initialValue={data.createdAt}
          />
          {bill == '出库单' ? (
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
              initialValue={'pay_method' in data ? data.pay_method : ""}
            />
          ) : (
            <></>
          )}
        </ProForm.Group>
        {bill == '出库单' ? (
          <ProForm.Group>
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
              initialValue={'c_number' in data ? data.c_number : ""}
              fieldProps={{
                showArrow: false,
                showSearch: true,
                optionItemRender(item) {
                  return item.value + ' - ' + item.key;
                },
                optionLabelProp: "value",
                onChange: (value: any, item: any) => {
                  if (value) {
                    formRef?.current?.setFieldsValue({ custom: item.id });
                    formRef?.current?.setFieldsValue({ c_name: item["data-item"].key });
                  }
                },
                onClear:() => {
                  formRef?.current?.setFieldsValue({ custom: 0 });
                  formRef?.current?.setFieldsValue({ c_name: '' });
                }
              }}
            />
            <ProFormText
              width="md"
              name="c_name"
              label="客户名称"
              tooltip="最长为 24 位"
              placeholder="请输入名称"
              disabled={true}
              initialValue={'c_name' in data ? data.c_name : ""}
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
          </ProForm.Group>
        ) : (
          <></>
        )}

        <ProForm.Item name="body" initialValue={defaultData} trigger="onValuesChange">
          <EditableProTable<ExBodyType | InBodyType>
            rowKey="id"
            toolBarRender={false}
            columns={columns}
            value={dataSource}
            onChange={() => {
              return setDataSource
            }}
            recordCreatorProps={{
              newRecordType: 'dataSource',
              position: 'bottom',
              creatorButtonText: '新增',
              // @ts-ignore
              record: () => ({
                id: Date.now()
              }),
            }}
            actionRef={actionRef}
            // controlled
            editable={{
              type: 'multiple',
              editableKeys,
              form,
              onChange: setEditableRowKeys,
              actionRender: (row, config, defaultDom) => {
                return [defaultDom.delete];
              },
              onValuesChange: (record, recordList) => {
                discountChange(record, recordList, bill);
                setDataSource(() => {
                  return recordList;
                });
              },
            }}
            summary={(pageData) => summary(pageData, bill)} />
        </ProForm.Item>
      </ProForm>
    </div>
      : <></>
  );
};

export default BillUpdate;
