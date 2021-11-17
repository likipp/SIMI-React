import { PageContainer } from '@ant-design/pro-layout';
import BaseBill from '@/components/BaseBill';
import useBillNumber from '@/Hooks/billNumber';
import { Spin } from 'antd';
import columns from '@/pages/InBill/columns';

export default () => {
  const billNumber = useBillNumber("入库单")
  return (
    <PageContainer>
      {
        billNumber ? <BaseBill bill={'入库单'} columns={columns} billNumber={billNumber} change/>
          : <Spin size="large" style={{display: "flex", justifyContent: "center", flexDirection:"row"}} />
      }
    </PageContainer>
  );
};
