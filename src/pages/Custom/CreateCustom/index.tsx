import React from 'react';
import { message } from 'antd';
import ProForm, {
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormTextArea
} from '@ant-design/pro-form';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export type CreateFormProps = {
  onCancel: (flag?: boolean) => void;
  // onSubmit: (values: FormValueType) => Promise<void>;
  createModalVisible: boolean;
  // values: Partial<API.RuleListItem>;
};

const createCustom: React.FC<CreateFormProps> = (props) => {
  console.log(props, "props")
  return (
    <ModalForm<{
      name: string;
      company: string;
    }>
      visible={props.createModalVisible}
      modalProps={{
        // onCancel: () => console.log('run'),
        onCancel: () => props.onCancel()
      }}
      onFinish={async (values) => {
        await waitTime(2000);
        console.log(values.name);
        message.success('提交成功');
        return true;
      }}
    >
      <ProForm.Group>
        <ProFormText
          width="md"
          name="name"
          label="客户名称"
          tooltip="最长为 24 位"
          placeholder="请输入名称"
          rules={[{ required: true, message: '请输入客户名称' }]}
        />

      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          options={[
            {
              value: 'default',
              label: '零售客户',
            },
            {
              value: 'vip',
              label: 'VIP代理',
            },
            {
              value: 'area',
              label: '区域代理',
            },
            {
              value: 'special ',
              label: '特约代理',
            },
            {
              value: 'tspecial ',
              label: '总代理',
            },
          ]}
          width="xs"
          name="level"
          label="客户等级"
          rules={[{ required: true, message: '请选择客户等级' }]}
        />
        <ProFormText
          width="md"
          name="discount"
          label="折扣率"
          disabled
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText width="md" name="phone" label="联系方式" placeholder="请输入联系方式" rules={[{ required: true, message: '请输入联系方式' }]} />
        <ProFormText width="md" name="address" label="客户地址" placeholder="请输入客户地址" rules={[{ required: true, message: '请输入客户地址' }]} />
      </ProForm.Group>
      <ProForm.Item>
        <ProFormTextArea
          name="mark"
          label="备注"
          placeholder="请输入备注"
        />
      </ProForm.Item>
    </ModalForm>
  );
};

export default createCustom
