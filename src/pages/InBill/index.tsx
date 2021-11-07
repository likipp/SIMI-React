import type { ProColumns } from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import BaseBill from '@/components/BaseBill';
import type { InSourceType } from '@/pages/ExBillDetail/data';
import { requestProduct, requestWareHouse } from '@/components/BaseBill/services';

const columns: ProColumns<InSourceType>[] = [
  {
    title: '序号',
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '产品代码',
    align: 'right',
    dataIndex: 'p_number',
    key: 'p_number',
    width: '10%',
    valueType: 'select',
    formItemProps: () => {
      return {
        rules: [{ required: true, message: '产品代码必填' }],
      };
    },
    fieldProps: (form, { rowKey }) => {
      return {
        optionItemRender(item: { label: string; value: string }) {
          return item.label + ' - ' + item.value;
        },
        showArrow: false,
        showSearch: true,
        onChange: (value: any, item: any) => {
          form.setFieldsValue({ [rowKey as any]: { p_number2: item.label } });
          form.setFieldsValue({[rowKey as any]: {unit_price: item.price}})
          form.setFieldsValue({[rowKey as any]: {ware_house: item.ware_house}})
        },
      };
    },
    request: requestProduct,
  },
  {
    title: '产品名称',
    align: 'right',
    dataIndex: 'p_name',
    width: '20%',
    formItemProps: () => {
      return {
        rules: [{ required: true, message: '产品名称必填' }],
      };
    },
    fieldProps: (from, { rowKey }) => {
      if (from) {
        const p_number = from.getFieldValue([rowKey || '', 'p_number']);
        from.setFields([
          {
            name: [`${rowKey}`, 'p_name'],
            value: p_number,
          },
        ]);
      }
      return {
        precision: 2,
        min: 0,
        max: 9999,
      };
    },
  },
  {
    title: '单价',
    align: 'right',
    dataIndex: 'unit_price',
    valueType: 'money',
    fieldProps: {
      precision: 2,
      min: 0,
      max: 9999,
    },
    formItemProps: () => {
      return {
        rules: [{ required: true, message: '单价必填' }],
      };
    },
  },
  {
    title: '仓库',
    align: 'right',
    dataIndex: 'ware_house',
    valueType: 'select',
    formItemProps: () => {
      return {
        rules: [{ required: true, message: '仓库必填' }],
      };
    },
    fieldProps: {
      showArrow: false,
      showSearch: true,
    },
    request: requestWareHouse,
  },
  {
    title: '数量',
    align: 'right',
    dataIndex: 'in_qty',
    valueType: 'digit',
    fieldProps: {
      precision: 0,
      min: 1,
      max: 9999,
    },
    formItemProps: () => {
      return {
        rules: [{ required: true, message: '数量必填' }],
      };
    },
  },
  {
    title: '产品代码',
    align: 'right',
    dataIndex: 'p_number2',
    hideInTable: true,
  },
  {
    title: '总价',
    align: 'right',
    dataIndex: 'total',
    valueType: 'money',
    formItemProps: () => {
      return {
        rules: [{ required: true, message: '总价必填' }],
      };
    },
  },
  {
    title: '操作',
    valueType: 'option',
  },
];

export default () => {
  return (
    <PageContainer>
      <BaseBill bill={'入库单'} columns={columns} />
    </PageContainer>
  );
};