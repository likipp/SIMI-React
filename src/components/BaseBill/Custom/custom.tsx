import type { ProFormInstance} from '@ant-design/pro-form';
import ProForm, { ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { getCustomQueryList } from '@/pages/Product/services';
import CopyButton from '@/components/CopyButton';
import type { MutableRefObject } from 'react';
import React from 'react';

type customProFormProps = {
  bill: string;
  realDiscount: number | undefined;
  c_number?: string;
  c_name?: string;
  formRef: MutableRefObject<ProFormInstance<any> | undefined>
}

const customProForm: React.FC<customProFormProps> = (props) => {
  const {bill, realDiscount, c_number, c_name, formRef} = props
  if (bill === '出库单') {
    return (
      <ProForm.Group>
        <ProFormSelect
          name="c_number"
          label="客户代码"
          showSearch
          width={'sm'}
          request={async (keyWords) => {
            return Promise.resolve(getCustomQueryList(keyWords)).then((res) => {
              return res.data;
            });
          }}
          placeholder="请输入客户代码"
          rules={[{ required: true, message: '客户代码必填' }]}
          initialValue={c_number ? c_number : ""}
          fieldProps={{
            showArrow: false,
            showSearch: true,
            optionItemRender(item) {
              return item.value + ' - ' + item.key;
            },
            optionLabelProp: "value",
            onChange: (value: any, item: any) => {
              if (value) {
                formRef?.current?.setFieldsValue({ custom: item.id });
                formRef?.current?.setFieldsValue({ c_name: item["data-item"].key });
              }
            },
            onClear:() => {
              formRef?.current?.setFieldsValue({ custom: 0 });
              formRef?.current?.setFieldsValue({ c_name: '' });
            }
          }}
        />
        <ProFormText
          width="md"
          name="c_name"
          label="客户名称"
          tooltip="最长为 24 位"
          placeholder="请输入名称"
          initialValue={c_name ? c_name : ""}
          disabled={true}
        />
        <ProFormText
          width="md"
          name="custom"
          label="客户名称"
          tooltip="最长为 24 位"
          placeholder="请输入名称"
          disabled={true}
          hidden={true}
        />
        {realDiscount ? <CopyButton realDiscount={realDiscount} /> : <></>}
      </ProForm.Group>
    )
  }
  return <></>
}

export default customProForm
