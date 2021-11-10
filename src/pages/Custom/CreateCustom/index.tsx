import React, { useRef } from 'react';
import { message } from 'antd';
import type { ProFormInstance} from '@ant-design/pro-form';
import ProForm, {
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormTextArea
} from '@ant-design/pro-form';
import { addCustom } from '@/pages/Custom/services';
import type { TableListItem } from '@/pages/Custom';
import { requestCustomLevelSelectList } from '@/components/BaseBill/services';

export type CreateFormProps = {
  onCancel: (flag?: boolean) => void;
  createModalVisible: boolean;
  reload: ((resetPageIndex?: (boolean | undefined)) => Promise<void>) | undefined;
};

const CreateCustom: React.FC<CreateFormProps> = (props) => {
  const {onCancel, createModalVisible, reload} = props
  const formRef = useRef<ProFormInstance>();
  return (
    <ModalForm<
      TableListItem
    >
      formRef={formRef}
      visible={createModalVisible}
      modalProps={{
        onCancel: () => {
          formRef.current?.resetFields()
          onCancel()
        }
      }}
      onFinish={async (values) => {
        // await waitTime(2000);
        const res = values
        res.level = parseInt(String(res.level))
        console.log(res);
        addCustom(res).then(() => {
          onCancel()
          reload?.()
          message.success('提交成功');
          return true;
        })
        return false
      }}
    >
      <ProForm.Group>
        <ProFormText
          width="md"
          name="c_number"
          label="客户编号"
          tooltip="最长为 24 位"
          placeholder="请输入编号"
          rules={[{ required: true, message: '请输入客户编号' }]}
        />
        <ProFormText
          width="md"
          name="c_name"
          label="客户名称"
          tooltip="最长为 24 位"
          placeholder="请输入名称"
          rules={[{ required: true, message: '请输入客户名称' }]}
        />
        <ProFormSelect
          width="xs"
          name="level"
          label="客户等级"
          request={requestCustomLevelSelectList}
          rules={[{ required: true, message: '请选择客户等级' }]}
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

export default CreateCustom
