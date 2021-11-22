import HeaderBillDetail from '@/components/HeaderBillDetail';
import ProForm, { ProFormDatePicker, ProFormRadio, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import type { ExSourceType, InSourceType } from '@/pages/ExBillDetail/data';
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import summary from '@/utils/summary';
import { useState } from 'react';
import { Spin } from 'antd';
// import CopyButton from '@/components/CopyButton';

interface BillReadOnlyProps {
  data: ExSourceType | InSourceType;
  columns: ProColumns<InSourceType>[] | ProColumns<ExSourceType>[];
  billType: string;
}

const BillReadOnly = (props: BillReadOnlyProps) => {
  const {columns, data, billType} = props
  const [loading] = useState(true)


  return data ? <div>
      <HeaderBillDetail number={data.bill_number} type={"in"}/>
      <ProForm<InSourceType | ExSourceType>
        submitter={{
          render: () => {
            return [];
          },
        }}
      >
        <ProForm.Group>
          <ProFormText width="sm" name="bill_number" label="单据编号" disabled={true} initialValue={data.bill_number}/>
          <ProFormDatePicker
            name="created_at"
            label="单据日期"
            initialValue={data.createdAt}
            disabled={true}
          />
          {
            billType == "出库单" ? (
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
                disabled={true}
                initialValue={data.pay_method}
              />
            )
              : <></>
          }
        </ProForm.Group>
        {billType == '出库单' ? (
          <ProForm.Group>
            <ProFormSelect
              name="c_number"
              label="客户代码"
              showSearch
              width={'sm'}
              disabled={true}
              initialValue={'c_number' in data ? data.c_number : null}
            />
            <ProFormText
              width="md"
              name="c_name"
              label="客户名称"
              tooltip="最长为 24 位"
              placeholder="请输入名称"
              disabled={true}
              initialValue={'c_name' in data ? data.c_name : null}
            />
          </ProForm.Group>
        ) : (
          <></>
        )}
        <ProForm.Item
          name="body"
        >
          <EditableProTable<InSourceType>
            rowKey="id"
            toolBarRender={false}
            columns={columns}
            value={data.body}
            recordCreatorProps={false}
            summary={(pageData) => summary(pageData, billType)}
          />
        </ProForm.Item>
      </ProForm>
    </div>
    : (
      <div style={{display: 'flex', justifyContent: 'center', alignContent: 'center',
        height: '100%', width: '100%',
        position: 'absolute',
        backgroundColor: 'blue'
      }}>
        <Spin spinning={loading} tip="加载中" style={{height: '100%'}}/>
      </div>
    )
}

export default BillReadOnly
