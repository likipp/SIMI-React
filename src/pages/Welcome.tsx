import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import DemoPie from '@/pages/Charts/pie';
import {KeepAlive} from 'umi'

export default (): React.ReactNode => {
  return (
   <KeepAlive>
     <PageContainer>
       <DemoPie/>
     </PageContainer>
   </KeepAlive>
  );
};
