import ProTable from '@ant-design/pro-table';
import { Typography } from 'antd';
import toDecimal2 from '@/utils/toDecimal2';
import { isNaN } from 'lodash';

const { Text } = Typography;

const summary = (pageData: any, bill: string) => {
  let totalNum = 0;
  let totalSum = 0;
  let totalProfit = 0
  let totalCost = 0;
  let ex_discount = 0
  let in_discount = 0
  for (const item of pageData) {
    console.log(item, "item")
    if (item.ex_qty) {
      totalNum += item.ex_qty;
    }
    if (item.in_qty) {
      totalNum += item.in_qty;
    }
    if (bill === "出库单") {
      if (item.ex_discount == undefined) {
        ex_discount = 100
      } else {
        ex_discount = item.ex_discount
      }
      if (item.in_discount == undefined) {
        in_discount = 100
      } else {
        in_discount = item.in_discount
      }
      console.log((item.ex_qty * item.unit_price * ex_discount) / 100, "总金额")
      totalSum += item.ex_qty * item.unit_price * ex_discount / 100
      totalCost += item.ex_qty * item.unit_price * in_discount / 100
      totalProfit += totalSum - totalCost
      continue
    }
    if (item.in_discount == undefined) {
      in_discount = 100
    } else {
      in_discount = item.in_discount
    }
    totalSum += toDecimal2((item.in_qty * item.unit_price * in_discount) / 100);
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
              总额：{isNaN(totalSum) ? 0 :totalSum}
            </Text>
          </ProTable.Summary.Cell>
          <ProTable.Summary.Cell index={3} align={'right'} colSpan={3}>
            <Text strong style={{ fontSize: '20px' }}>
              总利润：{isNaN(totalProfit) ? 0 :totalProfit}
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
                总额：{isNaN(totalSum) ? 0 : totalSum}
              </Text>
            </ProTable.Summary.Cell>
          </ProTable.Summary.Row>
      }
    </>
  );
};

export default summary;
