import { useParams } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { useEffect, useState } from 'react';
import { getExBillDetail } from '@/pages/ExBillDetail/services';
import type { ExSourceType } from '@/pages/ExBillDetail/data';
import columns from '@/pages/ExBill/columns';
import { BillContext } from '@/context/billChange';
import BillReadOnly from '@/components/BaseBill/ReadOnly';

export default () => {
  const number = useParams();
  const [data, setData] = useState<ExSourceType>();
  const [change, setChange] = useState(false)
  const handleChange = () => {
    setChange(true)
  }

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
      <BillContext.Provider value={{initState: change, updateState: handleChange}}>
        {
          change ? <></>
            : <BillReadOnly columns={columns} data={data as ExSourceType} billType="出库单"/>
        }
      </BillContext.Provider>
    </PageContainer>
  );
};
