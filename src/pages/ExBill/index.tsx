import type { ProColumns } from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import BaseBill from '@/components/BaseBill';
import { requestProduct, requestWareHouse } from '@/components/BaseBill/services';
import type {ExSourceType} from "@/pages/ExBillDetail/data";
import toDecimal2 from '@/utils/toDecimal2';
import { useState } from 'react';
import useBillNumber from '@/Hooks/billNumber';
import { Spin } from 'antd';



export default () => {

  const [realDiscount, ] = useState(0)
  const billNumber = useBillNumber("出库单")

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
            form.setFieldsValue({[rowKey as any]: {p_name: item.value}})
            form.setFieldsValue({[rowKey as any]: {ware_house: item.ware_house.toString()}})
          },
        };
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
      // fieldProps: (from, { rowKey }) => {
      //   if (from) {
      //     const p_number = from.getFieldValue([rowKey || '', 'p_number']);
      //     from.setFields([
      //       {
      //         name: [`${rowKey}`, 'p_name'],
      //         value: p_number,
      //       },
      //     ]);
      //   }
      //   // return {
      //   //   precision: 2,
      //   //   min: 0,
      //   //   max: 9999,
      //   // };
      // },
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
      title: '产品代码',
      dataIndex: 'p_number2',
      hideInTable: true,
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
      fieldProps: (form, { rowKey }) => {
        const unit_price = form.getFieldsValue([rowKey || '', 'unit_price'])
        const ex_qty = form.getFieldsValue([rowKey || '', 'ex_qty'])

        return {
          rules: [{ required: true, message: '成本必填' }],
          onChange: (item: any) => {
            const in_discount = Math.floor(item / ex_qty / unit_price * 100 * 1000) / 1000
            form.setFieldsValue({[rowKey as any]: {in_discount: in_discount}})
          },
        };
      },
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
      renderFormItem: (_, {record})  => {
        if (record?.total === undefined || record?.cost === undefined || isNaN(record?.total) || isNaN(record?.cost)) {
          return 0
        }
        return toDecimal2(record.total - record.cost)
      }
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'right',
    },
  ];

  return (
    <PageContainer>
      {
        billNumber ? <BaseBill bill={'出库单'} columns={columns} realDiscount={realDiscount} billNumber={billNumber}/>
          : <Spin size="large" style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection:"column",
            height: "100%"}} />
      }
    </PageContainer>
  );
};
