import { PageContainer } from '@ant-design/pro-layout';
import BaseBill from '@/components/BaseBill';
import { useState } from 'react';
import useBillNumber from '@/Hooks/billNumber';
import { Spin } from 'antd';
import columns from '@/pages/ExBill/columns';



export default () => {
  const [realDiscount, ] = useState(0)
  const billNumber = useBillNumber("出库单")



  return (
    <PageContainer>
      {
        billNumber ? <BaseBill bill={'出库单'} columns={columns} realDiscount={realDiscount} billNumber={billNumber} />
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
