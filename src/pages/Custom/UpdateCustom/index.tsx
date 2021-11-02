import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import ProForm, {
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormTextArea
} from '@ant-design/pro-form';
import type { TableListItem } from '@/pages/Custom';
import { getCustomList } from '@/pages/Custom/services';

export type UpdateFormProps = {
  onCancel: (flag?: boolean) => void;
  // onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  id: number
  // values: Partial<API.RuleListItem>;
};

const UpdateCustom: React.FC<UpdateFormProps> = (props) => {
  const {onCancel, updateModalVisible, id} = props
  const [initialValue, SetInitialValue] = useState<TableListItem>()

  // const requestCustom = async () => {
  //   return Promise.resolve(getCustomList({ id: id })).then((res) => {
  //     SetInitialValue(res.data);
  //   });
  // };
  useEffect(() => {
    getCustomList({id: id}).then((res) => {
      SetInitialValue(res.data)
    })
  }, [id])
  return (
    <ModalForm<
        TableListItem
      >
      visible={updateModalVisible}
      modalProps={{
        onCancel: () => onCancel()
      }}
      onFinish={async (values) => {
        // await waitTime(2000);
        console.log(values);
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
          initialValue={initialValue?.c_name}
          rules={[{ required: true, message: '请输入客户名称' }]}
        />
        <ProFormSelect
          options={[
            {
              value: '1',
              label: '零售客户',
            },
            {
              value: '2',
              label: 'VIP代理',
            },
            {
              value: '3',
              label: '区域代理',
            },
            {
              value: '4 ',
              label: '特约代理',
            },
            {
              value: '5 ',
              label: '总代理',
            },
          ]}
          width="xs"
          name="level"
          label="客户等级"
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

export default UpdateCustom
