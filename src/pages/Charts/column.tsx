import { useEffect, useState } from 'react';
import { Column } from '@ant-design/charts';
import { getExColumn } from '@/pages/Charts/services';
import { Card } from 'antd';

const DemoColumn = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    getExColumn().then((res) => {
      const temp = res.data
      temp.map((item: any) => {
        item.month = item.month + "月"
      })
      setData(() => {
        return temp
      })
    })
  }, []);

  const config = {
    data,
    xField: 'month',
    yField: 'value',
    seriesField: 'brand',
    isGroup: 'true',
    columnStyle: {
      radius: [20, 20, 0, 0],
    },
  };

  return (
    <Card>
      // @ts-ignore
      <Column {...config} />
    </Card>
  );
};

export default DemoColumn
