import ProTable from '@ant-design/pro-table';
import { Typography } from 'antd';

const { Text } = Typography;

const summary = (pageData: any, bill: string) => {
  let totalNum = 0;
  let totalSum = 0;
  let totalProfit = 0;
  for (const item of pageData) {
    if (bill === '出库单') {
      if (item.ex_qty) {
        totalNum += item.ex_qty;
      }
      if (item.total) {
        totalSum += item.total;
      }
      if (item.profit) {
        totalProfit += item.profit
      }
    } else {
      if (item.total) {
        totalSum += item.total
      }
      if (item.in_qty) {
        totalNum += item.in_qty;
      }
    }
  }

  return (
    <>
      {bill === '出库单' ? (
        <ProTable.Summary.Row>
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
              总额：{isNaN(totalSum) ? 0 : totalSum}
            </Text>
          </ProTable.Summary.Cell>
          <ProTable.Summary.Cell index={3} align={'right'} colSpan={3}>
            <Text strong style={{ fontSize: '20px' }}>
              总利润：{isNaN(totalProfit) ? 0 : totalProfit}
            </Text>
          </ProTable.Summary.Cell>
        </ProTable.Summary.Row>
      ) : (
        <ProTable.Summary.Row>
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
              总额：{isNaN(totalSum) ? 0 : totalSum}
            </Text>
          </ProTable.Summary.Cell>
        </ProTable.Summary.Row>
      )}
    </>
  );
};

export default summary;
