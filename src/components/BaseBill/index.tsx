import type { MutableRefObject } from 'react';
import React, { useRef, useState } from 'react';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm, {
  ProFormDatePicker,
  ProFormRadio,
  ProFormText,
} from '@ant-design/pro-form';
import { history } from 'umi';
import type { ExSourceType, InSourceType } from '@/pages/ExBillDetail/data';
import { Button, Form, message } from 'antd';
import { createExBill } from '@/pages/Product/services';
import moment from 'moment';
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import summary from '@/utils/summary';
import discountChange from '@/components/BaseBill/calculate';
import type { ExBodyType, InBodyType } from '@/pages/ExBillDetail/data';
import CustomProForm from '@/components/BaseBill/Custom/custom'

interface BillProps {
  bill: string;
  realDiscount?: number;
  billNumber: string;
  columns: ProColumns<InBodyType | ExBodyType>[];
}

const defaultData: (InBodyType | ExBodyType)[] = [];

const BaseBill: React.FC<BillProps> = (prop) => {
  const { bill, columns, realDiscount, billNumber } = prop;
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
    defaultData.map((item) => item.id),
  );
  const formRef = useRef<ProFormInstance>();
  const [dataSource, setDataSource] = useState<(InBodyType | ExBodyType)[]>(() => defaultData);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false)

  return (
    <div>
      <ProForm<InSourceType | ExSourceType>
        formRef={formRef as MutableRefObject<any>}
        onFinish={async (values) => {
          setLoading(true)
          const result: InSourceType | ExSourceType = values;
          result.bill_type = bill;
          // result.bill_number = billNumber;
          // delete result.c_name
          for (const i of result.body) {
            i.id = 0;
            i.ware_house = parseInt(String(i.ware_house));
          }
          console.log(result, "result")
          createExBill(result).then(() => {
            setLoading(false)
            message.success('单据创建成功', 2.5);
            form.resetFields();
            setDataSource([]);
            if (result.bill_type === "出库单") {
              formRef?.current?.setFieldsValue({ custom: '' });
              formRef?.current?.setFieldsValue({ c_name: '' });
              history.push("/stock-table/ex")
            } else {
              history.push("/stock-table/in")
            }
          }).catch(() => {
            setLoading(false)
          })
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
            initialValue={billNumber}
          />
          <ProFormDatePicker
            name="created_at"
            label="单据日期"
            initialValue={moment(new Date().getTime()).format('YYYY-MM-DD')}
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
            />
          ) : (
            <></>
          )}
        </ProForm.Group>
        <CustomProForm bill={bill} realDiscount={realDiscount} formRef={formRef} />
        <ProForm.Item name="body" initialValue={defaultData} trigger="onValuesChange">
          <EditableProTable<ExBodyType | InBodyType>
            rowKey="id"
            toolBarRender={false}
            columns={columns}
            value={dataSource}
            onChange={setDataSource}
            recordCreatorProps={{
              newRecordType: 'dataSource',
              position: 'bottom',
              creatorButtonText: '新增',
              // @ts-ignore
              record: () => ({
                id: Date.now()
              }),
            }}
            // controlled
            editable={{
              type: 'multiple',
              editableKeys,
              form,
              onChange: setEditableRowKeys,
              actionRender: (row, _, dom) => {
                return [dom.delete];
              },
              onValuesChange: (record, recordList) => {
                discountChange(record, recordList, bill, form);
                setDataSource(() => {
                  return recordList;
                });
              },
            }}
            summary={(pageData) => summary(pageData, bill)} />
        </ProForm.Item>
      </ProForm>
    </div>
  );
};

export default BaseBill;
