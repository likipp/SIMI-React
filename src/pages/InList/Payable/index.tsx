import React, { useEffect, useState } from 'react';
import ProForm, { DrawerForm, ProFormMoney, ProFormRadio, ProFormText } from '@ant-design/pro-form';
import { message, Timeline } from 'antd';
import type { PayItem } from '@/pages/InList';
import { getPayList, updatePayDiscount } from '@/pages/InList/services';
import moment from 'moment';
import { AlipayCircleOutlined, WechatOutlined } from '@ant-design/icons';

export type CreateFormProps = {
  drawerVisit: boolean;
  setDrawerVisit: React.Dispatch<React.SetStateAction<boolean>>;
  defaultPay: PayItem;
  reload: any
};

interface timeItem {
  source_bill: number;
  this_amount: number;
  pay_method: string;
  createdAt: string;
  status: number;
}

const CreatePayable: React.FC<CreateFormProps> = (props) => {
  const { setDrawerVisit, drawerVisit, defaultPay, reload } = props;

  const renderTime = (arr: any[]) =>
    arr.map((item, i) => {
      const len = arr.length;
      if (len === i + 1) {
        if (item.pay_method == 'ali') {
          return (
            <Timeline.Item
              label={moment(item.createdAt).format('YYYY-MM-DD HH:mm')}
              dot={<AlipayCircleOutlined style={{color: '#1890ff'}}/>}
            >
              {`${item.this_amount}元`}
            </Timeline.Item>
          );
        }
        return (
          <Timeline.Item
            label={moment(item.createdAt).format('YYYY-MM-DD HH:mm')}
            color="green"
            dot={<WechatOutlined />}
          >
            {`${item.this_amount}元`}
          </Timeline.Item>
        );
      }
      if (item.pay_method == 'ali') {
        return (
          <Timeline.Item
            label={moment(item.createdAt).format('YYYY-MM-DD HH:mm')}
            dot={<AlipayCircleOutlined style={{color: '#1890ff'}}/>}
          >
            {`${item.this_amount}元`}
          </Timeline.Item>
        );
      }
      return (
        <Timeline.Item
          label={moment(item.createdAt).format('YYYY-MM-DD HH:mm')}
          color="green"
          dot={<WechatOutlined />}
        >
          {`${item.this_amount}元`}
        </Timeline.Item>
      );
    });
  const [timeLine, setTimeLine] = useState<timeItem[]>([]);
  const [billStatus, setBillStatus] = useState('新增');
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getPayList({ bill: defaultPay.source_bill }).then((res) => {
      setTimeLine(res.data);
    });
    if (defaultPay.status) {
    }
    setBillStatus('查看');
  }, [defaultPay.source_bill, defaultPay.status]);

  return (
    <div>
      <DrawerForm
        onVisibleChange={setDrawerVisit}
        title={`${billStatus}表单`}
        visible={drawerVisit}
        drawerProps={{
          forceRender: true,
          destroyOnClose: true,
        }}
        submitter={{
          submitButtonProps: {
            loading: loading
          }
        }}
        onFinish={async (values) => {
          setLoading(true)
          message
            .loading("创建订单中")
            .then(() => updatePayDiscount(values as PayItem).then(() => {
              setLoading(false)
              message.success('提交成功');
              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
              reload
              return true
            }))
          return false
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
        <ProForm.Group>
          <ProFormRadio.Group
            name="pay_method"
            label="付款方式"
            hidden={defaultPay.status === 1}
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
          <ProFormMoney
            width="md"
            name="this_amount"
            label="付款金额"
            placeholder="请输入付款金额"
            hidden={defaultPay.status === 1}
          />
        </ProForm.Group>

        <div style={{ marginTop: '100px' }}>
          <Timeline mode={'left'} style={{ fontSize: '100px' }}>
            {renderTime(timeLine)}
          </Timeline>
          ,
        </div>
      </DrawerForm>
    </div>
  );
};

export default CreatePayable;
