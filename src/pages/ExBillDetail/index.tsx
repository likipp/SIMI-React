import { useParams } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { useEffect, useRef, useState } from 'react';
import { getExBillDetail } from '@/pages/ExBillDetail/services';
import { BillContext } from '@/context/billChange';
import BillReadOnly from '@/components/BaseBill/ReadOnly';
import type { ExBodyType, InBodyType, ExSourceType } from '@/pages/ExBillDetail/data';
import BillUpdate from '@/components/BaseBill/Update';
import type { ProFormInstance } from '@ant-design/pro-form';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { requestWareHouse } from '@/components/BaseBill/services';
import type { FormInstance } from 'antd';
import { getStockList } from '@/pages/ExistingStock/services';
import { parseInt } from 'lodash';
import styles from '@/pages/ExBill/exbill.less';
import CSelect from '@/components/CSelect/CSelect';

export default () => {
  const number = useParams();
  const [data, setData] = useState<ExSourceType>();
  const [change, setChange] = useState(false)
  const formRef = useRef<ProFormInstance>();
  const actionRef = useRef<ActionType>();

  const checkStock = (qty: number, stock: number) => {
    return new Promise((resolve) => {
      if (qty <= stock) {
        resolve(true)
      } else {
        resolve(false)
      }
    })
  }

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
      // fieldProps: productColumn,
      render: (_, record) => {
        return <span>{record.p_number}</span>
      },
      // request: requestProduct,
      renderFormItem: (_, {recordKey}, form) => <CSelect
        onChange={(value: any) => {
          if (value) {
            form.setFieldsValue({ [recordKey as string]: { p_number: value.value } })
            form.setFieldsValue({ [recordKey as string]: { unit_price: value.price } })
            form.setFieldsValue({ [recordKey as string]: { p_name: value.p_name } })
            form.setFieldsValue({ [recordKey as string]: { ware_house: value.ware_house.toString() } })
            const col = form.getFieldsValue(true)
            if (Object.keys(col).length !== 0) {
              const p_number = col[recordKey as string].p_number
              const ware_house = col[recordKey as string].ware_house
              getStockList({ p_number: p_number, ware_house: parseInt(ware_house)}).then((res) => {
                if (Object.keys(res.data).length !== 0) {
                  form.setFieldsValue({[recordKey as string]: {stock: res.data[0].qty}})
                } else {
                  form.setFieldsValue({[recordKey as string]: {stock: 0}})
                }
              })
            }
          }  else {
            form.resetFields([recordKey as string])
          }
        }}
      />,
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
      fieldProps: (form: FormInstance, {rowKey}) => {
        return {
          showArrow: false,
          showSearch: true,
          onChange: (value: string) => {
            if (value) {
              const col =  form.getFieldsValue(true)
              const p_number = col[rowKey as string].p_number
              getStockList({p_number: p_number, ware_house: parseInt(value)}).then((res) => {
                if (Object.keys(res.data).length !== 0) {
                  form.setFieldsValue({[rowKey as string]: {stock: res.data[0].qty}})
                } else {
                  form.setFieldsValue({[rowKey as string]: {stock: 0}})
                }
              })
            }
          }
        }
      },
      request: requestWareHouse,
    },
    {
      title: '即时库存',
      dataIndex: 'stock',
      renderFormItem: (_, { recordKey }, form) => {
        const col = form.getFieldsValue(true)
        if (Object.keys(col).length !== 0 && col[recordKey as string] != undefined) {
          const stock = col[recordKey as string].stock
          return <span className={stock > 0 ? styles.stockGT0Color : styles.stockLT0Color}>{stock}</span>
        }
        return <></>
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
      title: '数量',
      dataIndex: 'ex_qty',
      valueType: 'digit',
      fieldProps: {
        precision: 0,
        min: 1,
        max: 9999,
      },
      formItemProps: (form: FormInstance, { rowKey }) => {
        return {
          rules: [{ required: true, message: '数量必填' },
            // {
            //   validator: (rule, value, callback) => {
            //     const col =  form.getFieldsValue(true)
            //     const stock = col[rowKey as string].stock
            //     checkStock(value, stock).then((res) => {
            //       if (res) {
            //         callback()
            //       } else {
            //         callback("库存不足")
            //       }
            //     })
            //   }
            // }
            ],
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
    },
    {
      title: '操作',
      valueType: 'option',
      hideInTable: !change,
      render: (_, row) => [
        <a
          key="delete"
          onClick={() => {
            formRef.current?.setFieldsValue({
              body: data?.body.filter((item: any) => item.id !== row?.id),
            });
          }}
        >
          移除
        </a>
      ],
    },
  ];

  useEffect(() => {
    getExBillDetail(number)
      .then((res) => {
        setData(() => {
          return res.data
        });
      })
      .catch((err) => {
        console.log(err);
      })
  }, [number])

  return (
    <PageContainer
      header={{
        title: '出库单详情',
      }}
    >
      <BillContext.Provider value={{initState: change, dispatch: setChange}}>
        {
          change ? <BillUpdate bill={'出库单'} columns={columns} data={data as ExSourceType} actionRef={actionRef} formRef={formRef}/>
            : <BillReadOnly columns={columns} data={data as ExSourceType} billType="出库单"/>
        }
      </BillContext.Provider>
    </PageContainer>
  );
};
