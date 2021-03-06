import type { MutableRefObject } from 'react';
import React, { useContext, useEffect, useState } from 'react';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm, { ProFormDatePicker, ProFormRadio, ProFormText } from '@ant-design/pro-form';
import type { ExSourceType, InSourceType } from '@/pages/ExBillDetail/data';
import { Button, Form, message } from 'antd';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import { history } from '@@/core/history';
import summary from '@/utils/summary';
import { BillContext } from '@/context/billChange';
import discountChange from '@/components/BaseBill/calculate';
import CustomProForm from '@/components/BaseBill/Custom/custom';
import type { ExBodyType, InBodyType } from '@/pages/ExBillDetail/data';
import { updateExBill } from '@/pages/Product/services';
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

  useEffect(() => {
    data.body.map((item) => item.ware_house.toString())
    for (let i = 0; i < data.body.length; i++) {
      data.body[i].ware_house = data.body[i].ware_house.toString()
      actionRef.current?.startEditable(data.body[i].id)
    }
    setDataSource(data.body)

  }, [actionRef, data.body])

  return (
    data ? <div>
      <ProForm<InSourceType | ExSourceType>
        formRef={formRef as MutableRefObject<any>}
        onFinish={async (values) => {
          setLoading(true)
          const result: InSourceType | ExSourceType = values;
          for (const i of result.body) {
            // i.id = 0
            i.ware_house = parseInt(String(i.ware_house));
          }
          // history.push("/stock-table/in")
          updateExBill(result).then((res) => {
            message.success(res.errorMessage, 15);
            setLoading(false)
            if (bill == "?????????") {
              history.push(`/stock-table/ex`)
            } else {
              history.push(`/stock-table/in`)
            }
          }).catch((err) => {
            console.log(err)
          })
        }}
        submitter={{
          searchConfig: {
            resetText: '??????',
            submitText: '??????',
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
                ??????
              </Button>,
              <Button type="primary" key="submit" onClick={() => props.form?.submit?.()} loading={loading}>
                ??????
              </Button>,
            ];
          },
        }}
      >
        <ProForm.Group>
          <ProFormText
            width="sm"
            name="bill_number"
            label="????????????"
            disabled={true}
            initialValue={data.bill_number}
          />
          <ProFormDatePicker
            name="created_at"
            label="????????????"
            disabled={true}
            initialValue={data.createdAt}
          />
          {bill == '?????????' ? (
            <ProFormRadio.Group
              name="pay_method"
              label="????????????"
              options={[
                {
                  label: '?????????',
                  value: 'ali',
                },
                {
                  label: '??????',
                  value: 'wechat',
                },
              ]}
              rules={[{ required: true, message: '??????????????????' }]}
              initialValue={'pay_method' in data ? data.pay_method : ""}
            />
          ) : (
            <></>
          )}
        </ProForm.Group>
        <CustomProForm bill={bill} realDiscount={0} c_number={'c_number' in data ? data.c_number : ""}
                       c_name={'c_number' in data ? data.c_name : ""}
                       formRef={formRef} />

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
              creatorButtonText: '??????',
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
      : <></>
  );
};

export default BillUpdate;
