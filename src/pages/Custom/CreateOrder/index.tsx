import React from 'react';

import { message, Input } from 'antd';
import ProForm, {ModalForm, ProFormText} from '@ant-design/pro-form';
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';

import TagList from "@/pages/Custom/CreateOrder/tagList";

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

type DataSourceType = {
  id: React.Key;
  name?: string;
  price?: number;
  discount?: number;
  number?: number;
  total?: number;
  created_at?: string;
  children?: DataSourceType[];
};

const defaultData: DataSourceType[] = [];

const columns: ProColumns<DataSourceType>[] = [
  {
    title: '产品代码',
    dataIndex: 'p_number',
    width: '30%',
    formItemProps: () => {
      return {
        rules: [{required: true, message: "产品名称必填"}]
      }
    }
  },
  {
    title: '产品名称',
    dataIndex: 'p_name',
    width: '30%',
    formItemProps: () => {
      return {
        rules: [{required: true, message: "产品名称必填"}]
      }
    }
  },
  {
    title: '单价',
    dataIndex: 'unit_price',
    valueType: 'money',
    formItemProps: () => {
      return {
        rules: [{required: true, message: "单价必填"}]
      }
    }
  },
  {
    title: '折扣',
    dataIndex: 'discount',
  },
  {
    title: '数量',
    // valueType: 'option',
    dataIndex: 'qty',
    valueType: 'digit',
    formItemProps: () => {
      return {
        rules: [{required: true, message: "数量必填"}]
      }
    }
  },
  {
    title: '总价',
    dataIndex: 'total',
    valueType: 'money',
    formItemProps: () => {
      return {
        rules: [{required: true, message: "总价必填"}]
      }
    },
    renderFormItem: (_, {isEditable,record}) => (isEditable ? <TagList /> : <Input />),
      // if (record?.price && record?.number && record?.discount) {
      //   const total = record.price * record.number * record.discount
      //   return <ProFormText name="text" placeholder="请输入名称" />
      // }
      // return <Input />
    // },
    render: (_, row) => {
      let total: number
      if (row.number !== undefined && row.price !== undefined && row.discount !== undefined) {
        total = row.number * row.price * row.discount
        return <span>{total}</span>;
      }
      return <span />

    }
  }
];

export type CreateFormProps = {
  onCancel: (flag?: boolean) => void;
  // onSubmit: (values: FormValueType) => Promise<void>;
  createOrderVisible: boolean;
  // values: Partial<API.RuleListItem>;
};

const createOrder: React.FC<CreateFormProps> = (props) => {
  // const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
  //   defaultData.map((item) => item.id),
  // );
  console.log(props, "props")
  return (
    <ModalForm<{
      name: string;
      company: string;
    }>
      width={1000}
      visible={props.createOrderVisible}
      modalProps={{
        // onCancel: () => console.log('run'),
        onCancel: () => props.onCancel(),
        maskClosable: false
      }}
    >
      <ProForm<{
        name: string;
        company: string;
      }>
        onFinish={async (values) => {
          await waitTime(2000);
          console.log(values);
          message.success('提交成功');
        }}
        initialValues={{
          name: '蚂蚁设计有限公司',
          useMode: 'chapter',
        }}
      >
        <ProForm.Group>
          <ProFormText width="sm" name="id" label="单据编号" />
          <ProFormText
            width="md"
            name="name"
            label="客户名称"
            tooltip="最长为 24 位"
            placeholder="请输入名称"
          />
        </ProForm.Group>
        <ProForm.Item
          label="订单明细"
          name="dataSource"
          initialValue={defaultData}
          trigger="onValuesChange"
        >
          <EditableProTable<DataSourceType>
            rowKey="id"
            toolBarRender={false}
            columns={columns}
            recordCreatorProps={{
              newRecordType: 'dataSource',
              position: 'bottom',
              record: () => ({
                id: Date.now(),
                // total: record.price * record.number * record.discount
              }),
            }}
            editable={{
              type: 'multiple',
              // editableKeys,
              // onChange: setEditableRowKeys,
              actionRender: (row, _, dom) => {
                return [dom.delete];
              },
            }}
          />
        </ProForm.Item>
      </ProForm>
    </ModalForm>
  )
}

export default createOrder
