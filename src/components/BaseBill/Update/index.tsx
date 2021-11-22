import type { MutableRefObject } from 'react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm, {
  ProFormDatePicker,
  ProFormText,
} from '@ant-design/pro-form';
import type { ExSourceType, InSourceType } from '@/pages/ExBillDetail/data';
import { Button, Form } from 'antd';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import summary from '@/utils/summary';
import toDecimal2 from '@/utils/toDecimal2';
import { BillContext } from '@/context/billChange';
import calculateEx from '@/components/BaseBill/calculate';
import type { ExBodyType, InBodyType } from '@/pages/ExBillDetail/data';
// import CopyButton from '@/components/CopyButton';

interface BillProps {
  bill: string;
  data: InSourceType
  columns: ProColumns<ExBodyType | InBodyType>[];
}

const BillUpdate: React.FC<BillProps> = (prop) => {
  const defaultData: ExBodyType[] | InBodyType[] = [];
  const { bill, columns, data} = prop;
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
    defaultData.map((item) => item.id),
  );
  const formRef = useRef<ProFormInstance>();
  const actionRef = useRef<ActionType>();
  const change = useContext(BillContext)
  const [, setChange] = useState(change)
  const [dataSource, setDataSource] = useState<ExBodyType[] | InBodyType[]>(() => defaultData);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false)

  const discountChange = (record: any, recordList: any, type: string) => {
    const list = form.getFieldsValue(true);
    let qty = 0;
    if (record != undefined) {
      if (type == '出库单') {
        for (const listKey in list) {
          // qty = list[listKey].ex_qty;
          // const unit_price = list[listKey].unit_price;
          // let in_discount = list[listKey].in_discount;
          // let ex_discount = list[listKey].ex_discount;
          // if (in_discount == undefined) {
          //   in_discount = 100;
          // }
          // if (ex_discount == undefined) {
          //   ex_discount = 100;
          // }
          // record.p_number2 = list[listKey].p_number2;
          // const total: number = toDecimal2((unit_price * qty * ex_discount) / 100);
          // const cost: number = toDecimal2((unit_price * qty * in_discount) / 100);
          // const profit = toDecimal2(total - cost);
          const {total, cost, profit} =  calculateEx(qty, list, listKey)
          record.total = total
          record.cost = cost
          record.profit = profit
          // form.setFieldsValue({
          //   [listKey]: { total: total },
          // });
          record.total = total
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
          console.log(values, "提交内容")
          setLoading(true)
          // const result: InSourceType | ExSourceType = values;
          // result.bill_type = bill;
          // for (const i of result.body) {
          //   i.p_number = i.p_number2;
          //   i.p_number2 = '';
          //   i.id = 0;
          //   i.ware_house = parseInt(String(i.ware_house));
          // }
          // createExBill(result).then(() => {
          //   setLoading(false)
          //   message.success('单据创建成功', 2.5);
          //   formRef?.current?.setFieldsValue({ custom: '' });
          //   formRef?.current?.setFieldsValue({ c_name: '' });
          //   form.resetFields();
          //   setDataSource([]);
          //   history.push("/stock-table/in")
          // });
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
                  setChange(() => false)
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
        </ProForm.Group>

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
              actionRender: (row, _, dom) => {
                return [dom.delete];
              },
              onValuesChange: (record, recordList) => {
                discountChange(record, recordList, bill);
                // setDataSource(() => {
                //   return recordList;
                // });
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
