import { useParams } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { useEffect, useState } from 'react';
import type { InSourceType } from '@/pages/ExBillDetail/data';
import BillReadOnly from '@/components/BaseBill/ReadOnly';
import { BillContext } from '@/context/billChange';
import BillUpdate from '@/components/BaseBill/Update';
import { getInBillDetail } from '@/pages/InBillDetail/services';
import columns from '@/pages/InBill/columns';


// export const BillContext = createContext(false)
export default () => {
  const number = useParams();
  const [data, setData] = useState<InSourceType>()
  const [change, setChange] = useState(false)

  // const columns: ProColumns<InSourceType>[] = [
  //   {
  //     title: '序号',
  //     dataIndex: 'index',
  //     valueType: 'indexBorder',
  //     width: 48,
  //   },
  //   {
  //     title: '产品代码',
  //     dataIndex: 'p_number',
  //     key: 'p_number',
  //     width: '10%',
  //     valueType: 'select',
  //     request: requestProduct,
  //     fieldProps: (form, { rowKey }) => {
  //       return {
  //         optionItemRender(item: { label: string; value: string }) {
  //           return item.label + ' - ' + item.value;
  //         },
  //         showArrow: false,
  //         showSearch: true,
  //         onChange: (value: any, item: any) => {
  //           form.setFieldsValue({ [rowKey as any]: { p_number2: item.label } });
  //           form.setFieldsValue({[rowKey as any]: {unit_price: item.price}})
  //           form.setFieldsValue({[rowKey as any]: {ware_house: item.ware_house.toString()}})
  //         },
  //       };
  //     },
  //   },
  //   {
  //     title: '产品名称',
  //     dataIndex: 'p_name',
  //     width: '20%',
  //   },
  //   {
  //     title: '单价',
  //     dataIndex: 'unit_price',
  //     valueType: 'money',
  //   },
  //   {
  //     title: '仓库',
  //     dataIndex: 'ware_house',
  //     valueType: 'select',
  //     request: requestWareHouse,
  //   },
  //   {
  //     title: '数量',
  //     dataIndex: 'in_qty',
  //     valueType: 'digit',
  //   },
  //   {
  //     title: '进货折扣',
  //     dataIndex: 'in_discount',
  //     valueType: 'percent'
  //   },
  //   {
  //     title: '产品代码',
  //     align: 'right',
  //     dataIndex: 'p_number2',
  //     hideInTable: true,
  //   },
  //   {
  //     title: '金额',
  //     dataIndex: 'total',
  //     valueType: 'money',
  //   },
  //   {
  //     title: '操作',
  //     valueType: 'option',
  //     align: 'right',
  //     hideInTable: !change
  //   },
  // ];

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
  }, [])

  return (
    <PageContainer
      header={{
        title: '入库单详情',
      }}
    >
      <BillContext.Provider value={{change, setChange}}>
        {
          change ? <BillUpdate bill={'入库单'} columns={columns} data={data as InSourceType}/>
            : <BillReadOnly columns={columns} data={data as InSourceType} />
        }
      </BillContext.Provider>

    </PageContainer>
  );
};
