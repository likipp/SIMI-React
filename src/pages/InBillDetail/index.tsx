import { useParams } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { useEffect, useState } from 'react';
import type { InSourceType } from '@/pages/ExBillDetail/data';
import BillReadOnly from '@/components/BaseBill/ReadOnly';
import { BillContext, InitChange } from '@/context/billChange';
import BillUpdate from '@/components/BaseBill/Update';
import { getInBillDetail } from '@/pages/InBillDetail/services';
import columns from '@/pages/InBill/columns';


// export const BillContext = createContext(false)
export default () => {
  const number = useParams();
  const [data, setData] = useState<InSourceType>()
  // const [change, setChange] = useState(false)

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
      <BillContext.Provider value={InitChange}>
        {
          InitChange ? <BillUpdate bill={'入库单'} columns={columns} data={data as InSourceType}/>
            : <BillReadOnly columns={columns} data={data as InSourceType} billType="入库单"/>
        }
      </BillContext.Provider>

    </PageContainer>
  );
};
