import type { ProColumns } from '@ant-design/pro-table';
import type { InBodyType } from '@/pages/ExBillDetail/data';
import { requestProduct, requestWareHouse } from '@/components/BaseBill/services';
import productColumn from '@/pages/Product/productColumn';
import type { ExBodyType } from '@/pages/ExBillDetail/data';
import CSelect from '@/components/CSelect/CSelect';

const columns: ProColumns<ExBodyType | InBodyType>[] = [
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
    renderFormItem: (_, {recordKey}, form) => <CSelect
      onChange={(value: any) => {
        if (value) {
          form.setFieldsValue({ [recordKey as string]: { p_number: value.value } })
          form.setFieldsValue({ [recordKey as string]: { unit_price: value.purchase_price } })
          form.setFieldsValue({ [recordKey as string]: { p_name: value.p_name } })
          form.setFieldsValue({ [recordKey as string]: { ware_house: value.ware_house.toString() } })
        } else {
          form.resetFields([recordKey as string])
        }
      }}
    />,
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
    // render: (_, row) => [
    //   <a
    //     key="delete"
    //     onClick={() => {
    //       const tableDataSource = formRef.current?.getFieldValue('table') as DataSourceType[];
    //       formRef.current?.setFieldsValue({
    //         table: tableDataSource.filter((item) => item.id !== row?.id),
    //       });
    //     }}
    //   >
    //     移除
    //   </a>,
    //   <a
    //     key="edit"
    //     onClick={() => {
    //       actionRef.current?.startEditable(row.id);
    //     }}
    //   >
    //     编辑
    //   </a>,
    // ],
  },
];

export default columns
