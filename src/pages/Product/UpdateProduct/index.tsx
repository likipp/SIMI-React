import React, { useEffect, useRef, useState } from 'react';
import type {
  ProFormInstance} from '@ant-design/pro-form';
import ProForm, {
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormMoney,
  ProFormTextArea
} from '@ant-design/pro-form';
import type { ProductListItem } from '@/pages/Product/data';
import { requestUnitSelectList, requestBrandSelectList, requestWareHouse } from '@/components/BaseBill/services';
import { addProduct, generateProductNumber, updatesProduct } from '@/pages/Product/services';
import { message } from 'antd';

export type updateFormProps = {
  data: ProductListItem;
  onCancel: (flag?: boolean) => void;
  updateModalVisible: boolean;
  reload: ((resetPageIndex?: (boolean | undefined)) => Promise<void>) | undefined;
  copy: string
}

const UpdateProduct: React.FC<updateFormProps> = (props) => {
  const {onCancel, updateModalVisible, reload, data, copy} = props
  const formRef = useRef<ProFormInstance>()
  const [, setActions] = useState("编辑")
  // const [disabled, setDisabled] = useState(false)

  const onFill = () => {
    formRef?.current?.setFieldsValue({
      id: data.id,
      p_number: data.p_number,
      p_name: data.p_name,
      p_price: data.p_price,
      unit: String(data.unit),
      ware_house: String(data.ware_house),
      brand: String(data.brand),
      p_spec: data.p_spec,
    });
  };

  useEffect(() => {
    onFill()
  }, [data.id > 0])

  useEffect(() => {
    setActions("新建")
    // setDisabled(true)
  }, [copy === "新建"])
  return (

    <ModalForm<ProductListItem>
      title={`${copy}产品`}
      visible={updateModalVisible}
      modalProps={{
        onCancel: () => {
          formRef.current?.resetFields()
          onCancel();
        }
      }}
      onFinish={async (values) => {
        const result = values
        result.unit = parseInt(String(result.unit))
        result.brand = parseInt(String(result.brand))
        result.ware_house = parseInt(String(result.ware_house))
        result.id = data.id
        if (copy === "编辑") {
          updatesProduct(result).then(() => {
            onCancel()
            reload?.()
            message.success('编辑成功');
            return true;
          })
        } else {
          result.id = 0
          generateProductNumber({parent: result.brand}).then((res) => {
            result.p_number = res.data
            addProduct(result).then(() => {
              onCancel()
              reload?.()
              message.success('新建成功');
              return true;
            })
          })
        }
        return false
      }}
      formRef={formRef}
    >
      <ProForm.Group >
        <ProFormText
          width="md"
          name="p_number"
          label="产品代码"
          placeholder="请输入编号"
          disabled={true}
          // initialValue={data.p_number}
          rules={[{ required: true, message: '请输入产品编号' }]}
        />
        <ProFormText
          width="md"
          name="p_name"
          label="产品名称"
          placeholder="请输入名称"
          // initialValue={data.p_name}
          rules={[{ required: true, message: '请输入产品名称' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          label="仓库"
          name="ware_house"
          request={requestWareHouse}
          // initialValue={String(data.ware_house)}
          rules={[{ required: true, message: '请选择仓库' }]}
        />
        <ProFormSelect
          label="单位"
          name="unit"
          request={requestUnitSelectList}
          // initialValue={String(data.unit)}
          rules={[{ required: true, message: '请选择单位' }]}
        />
        <ProFormSelect
          label="品牌"
          name="brand"
          request={requestBrandSelectList}
          initialValue={String(data.brand)}
          rules={[{ required: true, message: '请选择品牌' }]}
        />
        <ProFormMoney
          label="单价"
          name="p_price"
          customSymbol="💰"
          locale="zh-CN"
          min={0}
          // initialValue={data.p_price}
          rules={[{ required: true, message: '请输入单价' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormTextArea
          name="p_spec"
          label="规格"
          placeholder="请输入规格"
          width="lg"
          // initialValue={data.p_spec}
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

export default UpdateProduct
