import React from 'react';
import ProForm, { ModalForm, ProFormText, ProFormSelect, ProFormMoney, ProFormTextArea } from '@ant-design/pro-form';
import type { ProductListItem } from '@/pages/Product/data';
import { requestUnitSelectList, requestBrandSelectList, requestWareHouse } from '@/components/BaseBill/services';
import { addProduct } from '@/pages/Product/services';
import { message } from 'antd';

export type CreateFormProps = {
  onCancel: (flag?: boolean) => void;
  createModalVisible: boolean;
}

const createProduct: React.FC<CreateFormProps> = (props) => {
  const {onCancel, createModalVisible} = props
  return (
    <ModalForm<ProductListItem>
      visible={createModalVisible}
      modalProps={{
        onCancel: () => onCancel()
      }}
      onFinish={async (values) => {
        const result = values
        result.unit = parseInt(String(result.unit))
        result.brand = parseInt(String(result.brand))
        result.ware_house = parseInt(String(result.ware_house))
        // result.p_price= toDecimal2(values.p_price)
        addProduct(result).then(() => {
          message.success('提交成功');
          return true;
        })
        return false
      }}
    >
      <ProForm.Group >
        <ProFormText
          width="md"
          name="p_number"
          label="产品代码"
          // tooltip="最长为 24 位"
          placeholder="请输入编号"
          rules={[{ required: true, message: '请输入产品编号' }]}
        />
        <ProFormText
          width="md"
          name="p_name"
          label="产品名称"
          placeholder="请输入名称"
          rules={[{ required: true, message: '请输入产品名称' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          label="仓库"
          name="ware_house"
          request={requestWareHouse}
          rules={[{ required: true, message: '请选择仓库' }]}
        />
        <ProFormSelect
          label="单位"
          name="unit"
          request={requestUnitSelectList}
          rules={[{ required: true, message: '请选择单位' }]}
        />
        <ProFormSelect
          label="品牌"
          name="brand"
          request={requestBrandSelectList}
          rules={[{ required: true, message: '请选择品牌' }]}
        />
        <ProFormMoney
          label="单价"
          name="p_price"
          customSymbol="💰"
          locale="zh-CN"
          min={0}
          rules={[{ required: true, message: '请输入单价' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormTextArea
          name="p_spec"
          label="规格"
          placeholder="请输入名称"
          width="lg"
          fieldProps={{
            rows: 4,
            allowClear: true,
            showCount: true
          }}
        />
      </ProForm.Group>
    </ModalForm>
  )
}

export default createProduct
