import React, { useEffect, useState } from 'react';
import ProForm, {
  DrawerForm,
  ProFormMoney,
  ProFormText,
} from '@ant-design/pro-form';
import { message, Timeline } from 'antd';
import type { PayItem } from '@/pages/InList';
import { getPayList, updatePayDiscount } from '@/pages/InList/services';
import moment from 'moment';

export type CreateFormProps = {
  drawerVisit: boolean;
  setDrawerVisit: (flag?: boolean) => void;
  defaultPay: PayItem
};

interface timeItem {
  source_bill: number;
  this_amount: number;
  // PayMethod  string  `json:"pay_method"`
  createdAt:   string;
  status:     number
}

const CreatePayable: React.FC<CreateFormProps> = (props) => {
  const {setDrawerVisit, drawerVisit, defaultPay} = props
  // const timeLine = ["Create a services site 2015-09-01", "Solve initial network problems 2015-09-01", "Technical testing 2015-09-01"]

  // const renderTime = (arr: any[]) => arr ? arr.map((item) => {
  //   console.log(item, "item")
  //   return <Timeline.Item label={moment(item.created_at).format( 'YYYY-MM-DD HH:mm:ss')}>{item.this_amount}</Timeline.Item>
  // }) : null

  const renderTime = (arr: any[]) => arr.map((item, i) => {
    console.log(item, "item")
    const len = arr.length
    if (len === i + 1) {
      return <Timeline.Item label={moment(item.createdAt).format( 'YYYY-MM-DD HH:mm:ss')} color='green'>{`${item.this_amount}元`}</Timeline.Item>
    }
    return <Timeline.Item label={moment(item.createdAt).format( 'YYYY-MM-DD HH:mm:ss')}>{`${item.this_amount}元`}</Timeline.Item>
  })
  const [timeLine, setTimeLine] = useState<timeItem[]>([])
  const [billStatus, setBillStatus] = useState('新增')

  useEffect(() => {
    getPayList(defaultPay.source_bill).then((res) => {
      setTimeLine(res.data)
    })
    if (defaultPay.status) {}
    setBillStatus("查看")
  }, [defaultPay.source_bill])

  return <div>
    <DrawerForm
      onVisibleChange={setDrawerVisit}
      title={`${billStatus}表单`}
      visible={drawerVisit}
      onFinish={async (values) => {
        updatePayDiscount(values as PayItem).then(() => {
          message.success('提交成功');
        }).catch(err => {
          console.log(err, "错误了")
        })

        return true;
      }}
    >
      <ProForm.Group>
        <ProFormText
          disabled={true}
          width="md"
          name="number"
          label="源单单号"
          placeholder="请输入源单单号"
          initialValue={defaultPay.number}
        />
        <ProFormText
          hidden={true}
          disabled={true}
          width="md"
          name="source_bill"
          label="源单单号"
          placeholder="请输入源单单号"
          initialValue={defaultPay.source_bill}
        />
        <ProFormMoney
          disabled={true}
          width="md"
          name="bill_amount"
          label="订单金额"
          initialValue={defaultPay.bill_amount}
        />
      </ProForm.Group>
      <ProFormMoney width="md" name="this_amount" label="付款金额" placeholder="请输入付款金额" hidden={defaultPay.status === 1}/>
      <div style={{marginTop:"100px"}}>
        <Timeline mode={'left'} style={{fontSize: '30px'}}>
          {renderTime(timeLine)}
        </Timeline>,
      </div>
    </DrawerForm>
  </div>
}

export default CreatePayable
