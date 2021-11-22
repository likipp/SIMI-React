import { useParams } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { useEffect, useState } from 'react';
import { getExBillDetail } from '@/pages/ExBillDetail/services';
import type { ExSourceType } from '@/pages/ExBillDetail/data';
import columns from '@/pages/ExBill/columns';
import { BillContext, InitChange } from '@/context/billChange';
import BillReadOnly from '@/components/BaseBill/ReadOnly';

export default () => {
  const number = useParams();
  const [data, setData] = useState<ExSourceType>();

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
  }, [])

  return (
    <PageContainer
      header={{
        title: '出库单详情',
      }}
    >
      <BillContext.Provider value={InitChange}>
        {
          InitChange ? <></>
            : <BillReadOnly columns={columns} data={data as ExSourceType} billType="出库单"/>
        }
      </BillContext.Provider>
    </PageContainer>
  );
};
