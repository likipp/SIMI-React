import type { ProColumns } from '@ant-design/pro-table';
import type { ExSourceType } from '@/pages/ExBillDetail/data';
import { requestProduct, requestWareHouse } from '@/components/BaseBill/services';
import productColumn from '@/pages/Product/productColumn';

const columns: ProColumns<ExSourceType>[] = [
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
    fieldProps: productColumn,
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
    title: '数量',
    dataIndex: 'ex_qty',
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
    title: '会员折扣',
    dataIndex: 'ex_discount',
    valueType: 'percent',
    fieldProps: {
      precision: 3,
      min: 0,
      max: 100,
    },
    formItemProps: () => {
      return {
        rules: [{ required: true, message: '会员折扣必填' }],
      };
    },
  },
  {
    title: '金额',
    dataIndex: 'total',
    valueType: 'money',
    fieldProps: {
      rules: [{ required: true, message: '金额必填' }],
    }
  },
  {
    title: '进货折扣',
    dataIndex: 'in_discount',
    valueType: 'percent',
    fieldProps: {
      precision: 3,
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
    title: '成本',
    dataIndex: 'cost',
    valueType: 'money',
    // fieldProps: (form, { rowKey }) => {
    //   const unit_price = form.getFieldsValue([rowKey || '', 'unit_price'])
    //   const ex_qty = form.getFieldsValue([rowKey || '', 'ex_qty'])
    //
    //   return {
    //     rules: [{ required: true, message: '成本必填' }],
    //     onChange: (item: any) => {
    //       const in_discount = Math.floor(item / ex_qty / unit_price * 100 * 1000) / 1000
    //       form.setFieldsValue({[rowKey as any]: {in_discount: in_discount}})
    //     },
    //   };
    // },
  },


  {
    title: '利润',
    dataIndex: 'profit',
    valueType: 'money',
    formItemProps: () => {
      return {
        rules: [{ required: true, message: '利润必填' }],
      };
    },
    // renderFormItem: (_, {record})  => {
    //   if (record?.total === undefined || record?.cost === undefined || isNaN(record?.total) || isNaN(record?.cost)) {
    //     return 0
    //   }
    //   return toDecimal2(record.total - record.cost)
    // }
  },
  {
    title: '操作',
    valueType: 'option',
    align: 'right',
  },
];

export default columns