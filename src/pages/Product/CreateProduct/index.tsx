import React, { useRef, useState } from 'react';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm, {
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormMoney,
  ProFormTextArea,
  ProFormUploadButton
} from '@ant-design/pro-form';
import type { ProductListItem } from '@/pages/Product/data';
import { requestUnitSelectList, requestBrandSelectList, requestWareHouse } from '@/components/BaseBill/services';
import { addProduct, generateProductNumber, uploadPic } from '@/pages/Product/services';
import { message } from 'antd';
import type { RcFile } from 'antd/es/upload';
// import {uploadPic} from "@/pages/uploadPic/services";

export type CreateFormProps = {
  onCancel: (flag?: boolean) => void;
  createModalVisible: boolean;
  brand: number;
  reload: ((resetPageIndex?: (boolean | undefined)) => Promise<void>) | undefined;
}

const CreateProduct: React.FC<CreateFormProps> = (props) => {
  const {onCancel, createModalVisible, brand, reload} = props
  const formRef = useRef<ProFormInstance>();
  const [fileList, setFileList] = useState<RcFile>()

  return (
    <ModalForm<ProductListItem>
      formRef={formRef}
      visible={createModalVisible}
      modalProps={{
        onCancel: () => {
          formRef.current?.resetFields()
          onCancel()
        }
      }}
      onFinish={async (values) => {
        const result = values
        if (result.picture) {
          console.log(result.picture, "创建")
          uploadPic({file: fileList as RcFile, brand: result.brand}).then((res) => {
            result.unit = parseInt(String(result.unit))
            result.brand = parseInt(String(result.brand))
            result.ware_house = parseInt(String(result.ware_house))
            result.picture = res.data.image_url
            console.log(res.data.image_url, "res")
            addProduct(result).then((res) => {
              console.log(res.success, "成功与否")
              onCancel()
              reload?.()
              message.success('提交成功');
            }).catch((err) => {
              console.log(err, "err")
            })
            // 椰子油高蛋白奶茶
            return true
          }).catch((error) => {
            console.log(error, "错误消息")
            return false
          })
        }
      }}
      // @ts-ignore
      request={async () => {
        const res = await generateProductNumber({parent: brand})
        return {
          p_number: res.data,
          brand: brand.toString(),
        }
      }}
    >
      <ProForm.Group >
        <ProFormText
          width="md"
          name="p_number"
          label="产品代码"
          // tooltip="最长为 24 位"
          placeholder="请输入编号"
          disabled={true}
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
          label="采购单价"
          name="purchase_price"
          width="xs"
          customSymbol="💰"
          locale="zh-CN"
          min={0}
          rules={[{ required: true, message: '请输入采购单价' }]}
        />
        <ProFormMoney
          label="销售单价"
          name="sale_price"
          width="xs"
          customSymbol="💰"
          locale="zh-CN"
          min={0}
          rules={[{ required: true, message: '请输入销售单价' }]}
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
      <ProForm.Group>
        <ProFormUploadButton
          name="picture"
          label="图片"
          // action={(file) => {
          //   uploadPic(file).then((res) => {
          //     console.log(res, "res")
          //   }).catch((error) => {
          //     console.log(error, "错误消息")
          //   })
          // }}
          listType='picture'
          fieldProps={{
            beforeUpload: (file) => {
              // console.log(file,"文件上传")
              console.log(file, "file")
              setFileList(file)
            }
          }}
        />
      </ProForm.Group>
    </ModalForm>
  )
}

export default CreateProduct
