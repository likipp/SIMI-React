import { useParams } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { useEffect, useRef, useState } from 'react';
import type { InSourceType } from '@/pages/ExBillDetail/data';
import BillReadOnly from '@/components/BaseBill/ReadOnly';
import { BillContext } from '@/context/billChange';
import BillUpdate from '@/components/BaseBill/Update';
import { getInBillDetail } from '@/pages/InBillDetail/services';
// import columns from '@/pages/InBill/columns';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import type { ExBodyType, InBodyType } from '@/pages/ExBillDetail/data';
// import productColumn from '@/pages/Product/productColumn';
import { requestProduct, requestWareHouse } from '@/components/BaseBill/services';
import type { ProFormInstance } from '@ant-design/pro-form';
import CSelect from '@/components/CSelect/CSelect';
import { getStockList } from '@/pages/ExistingStock/services';
import { parseInt } from 'lodash';
// import type { DataSourceType } from '@/pages/InBillDetail/data';

export default () => {
  const number = useParams();
  const [data, setData] = useState<InSourceType>()
  // const change = useContext(BillContext)
  const [change, setChange] = useState(false)
  // const handleChange = (b: boolean) => {
  //   setChange(b)
  // }
  const formRef = useRef<ProFormInstance>();
  const actionRef = useRef<ActionType>();
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
      request: requestProduct,
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
                  console.log(form.getFieldsValue(true))
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
      hideInTable: !change,
      render: (_, row) => [
        <a
          key="delete"
          onClick={() => {
            // const tableDataSource = formRef.current?.getFieldsValue(true);
            // const bodyDataSource = formRef.current?.getFieldValue('body') as DataSourceType[];
            formRef.current?.setFieldsValue({
              body: data?.body.filter((item: any) => item.id !== row?.id),
            });
          }}
        >
          移除
        </a>,
      ],
    },
  ];

  useEffect(() => {
    getInBillDetail(number)
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
        title: '入库单详情',
      }}
    >
      <span style={{backgroundColor: 'blue'}}>{change}</span>
      <BillContext.Provider value={{initState: change, dispatch: setChange}}>
        {
          change ? <BillUpdate bill={'入库单'} columns={columns} data={data as InSourceType} actionRef={actionRef} formRef={formRef}/>
            : <BillReadOnly columns={columns} data={data as InSourceType} billType="入库单"/>
        }
      </BillContext.Provider>

    </PageContainer>
  );
};
