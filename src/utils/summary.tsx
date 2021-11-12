import ProTable from '@ant-design/pro-table';
import { Typography } from 'antd';
import toDecimal2 from '@/utils/toDecimal2';

const { Text } = Typography;

const summary = (pageData: any, bill: string) => {
  let totalNum = 0;
  let totalSum = 0;
  let totalProfit = 0
  // pageData.forEach(({ total, ex_qty }) => {
  //   if (ex_qty) totalNum += ex_qty;
  //   if (total) totalSum += total;
  // });
  // for (const i in pageData) {
  //   if (pageData[i].ex_qty) {
  //     totalNum += pageData[i].ex_qty;
  //   }
  //   if (pageData[i].total) {
  //     totalSum += pageData[i].ex_qty;
  //   }
  // }
  for (const item of pageData) {
    if (item.ex_qty) {
      totalNum += item.ex_qty;
    }

    if (item.in_qty) {
      totalNum += item.in_qty;
    }
    if (item.total) {
      totalSum += item.total;
    }
    if (item.profit) {
      totalProfit += item.profit
    }
  }

  return (
    <>
      {
        bill === "出库单" ? <ProTable.Summary.Row>
          <ProTable.Summary.Cell index={1} colSpan={2}>
            <Text strong style={{ fontSize: '20px' }}>
              合计:
            </Text>
          </ProTable.Summary.Cell>
          <ProTable.Summary.Cell align={'right'} index={2} colSpan={4}>
            <Text strong style={{ fontSize: '20px' }}>
              总数：{totalNum}
            </Text>
          </ProTable.Summary.Cell>
          <ProTable.Summary.Cell index={3} align={'right'} colSpan={2}>
            <Text strong style={{ fontSize: '20px' }}>
              总额：{totalSum}
            </Text>
          </ProTable.Summary.Cell>
          <ProTable.Summary.Cell index={3} align={'right'} colSpan={3}>
            <Text strong style={{ fontSize: '20px' }}>
              总利润：{toDecimal2(totalProfit)}
            </Text>
          </ProTable.Summary.Cell>
        </ProTable.Summary.Row>
          : <ProTable.Summary.Row>
            <ProTable.Summary.Cell index={1} colSpan={2}>
              <Text strong style={{ fontSize: '20px' }}>
                合计:
              </Text>
            </ProTable.Summary.Cell>
            <ProTable.Summary.Cell align={'right'} index={2} colSpan={4}>
              <Text strong style={{ fontSize: '20px' }}>
                总数：{totalNum}
              </Text>
            </ProTable.Summary.Cell>
            <ProTable.Summary.Cell index={3} align={'right'} colSpan={2}>
              <Text strong style={{ fontSize: '20px' }}>
                总额：{totalSum}
              </Text>
            </ProTable.Summary.Cell>
          </ProTable.Summary.Row>
      }
    </>
  );
};

export default summary;
