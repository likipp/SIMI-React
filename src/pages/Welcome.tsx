import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import DemoPie from '@/pages/Charts/pie';
import { getPayPie } from '@/pages/Charts/services';

export default (): React.ReactNode => {
  const [pieData, setPieData] = useState()

  useEffect(() => {
    getPayPie().then((res) => {
      console.log(res.data, "res")
      setPieData(() => {
        return res.data
      })
    })
  }, [])
  return (
    <PageContainer>
      {
        pieData ? <DemoPie pieData={pieData}/>
          : <></>
      }
    </PageContainer>
  );
};
