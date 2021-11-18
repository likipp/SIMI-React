import type { ProColumns } from '@ant-design/pro-table';
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
    dataIndex: 'p_number',
    key: 'p_number',
    width: '15%',
    valueType: 'select',
    formItemProps: () => {
      return {
        rules: [{ required: true, message: '产品代码必填' }],
      };
    },
    fieldProps: (form, { rowKey }) => {
      return {
        optionItemRender(item: { key: string; value: string }) {
          return item.value + ' - ' + item.key;
        },
        showArrow: false,
        showSearch: true,
        onChange: (value: any, item: any) => {
          form.setFieldsValue({ [rowKey as any]: { p_name: item.p_name } });
          form.setFieldsValue({[rowKey as any]: {unit_price: item.price}})
          form.setFieldsValue({[rowKey as any]: {ware_house: item.ware_house.toString()}})
        },
        onSelect: (value: any, option: any) => {
          option.label = value;
          option["data-item"].label = value;
        }
      };
    },
    render: (_, record) => {
      return <span>{record.p_number}</span>
    },
    request: requestProduct,
  },
  {
    title: '产品名称',
    dataIndex: 'p_name',
    width: '20%',
    formItemProps: () => {
      return {
        rules: [{ required: true, message: '产品名称必填' }],
      };
    }
  },
  {
    title: '单价',
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
    title: '进货折扣',
    dataIndex: 'in_discount',
    valueType: 'percent',
    fieldProps: {
      precision: 2,
      min: 0,
      max: 100,
    },
    formItemProps: () => {
      return {
        rules: [{ required: true, message: '进货折扣必填' }],
      };
    },
  },
  {
    title: '总价',
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

export default columns
