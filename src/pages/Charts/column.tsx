import { useEffect, useState } from 'react';
import { Column } from '@ant-design/charts';
import { getExColumn } from '@/pages/Charts/services';
import { Card } from 'antd';
import type { columnData } from '@/pages/Charts/data';

const DemoColumn = () => {
  const [data, setData] = useState<columnData[]>();
  useEffect(() => {
    getExColumn().then((res) => {
      const temp = res.data
      if (temp != undefined) {
        temp.map((item: any) => {
          item.month = item.month + "月"
        })
        setData(() => {
          return temp
        })
      }
    })
  }, []);

  const config = {
    data,
    xField: 'month',
    yField: 'value',
    seriesField: 'brand',
    isGroup: true,
    columnStyle: {
      radius: [20, 20, 0, 0],
    },
  };
  return (
    <div>
      {
        data != undefined ? <Card title={"月销售表"}>
            <Column {...config} />
          </Card>
          : <></>
      }
    </div>
  );
};

export default DemoColumn
