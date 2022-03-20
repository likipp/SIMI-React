import { Tooltip } from 'antd';
import moment from "moment/moment";
import styles from './index.less';

type TableProps = {
  list: any,
  type: string
};

const CusTable = (props: TableProps) => {
  const {list, type} = props
  const res = []
  for (let i = 0; i < list.length; i ++) {
    const value = list[i][type]
    if (type === "created_at") {
      res.push(<span className={i + 1 === list.length ? styles.tableTrans : styles.tableTransBorder}>{moment(value).format('YYYY-MM-DD')} </span>)
    } else if (type === "systemNote" || type === "customerServiceNote") {
      if (value === null || value === undefined || value == "") {
        res.push(<span className={i + 1 === list.length ? styles.tableTrans : styles.tableTransBorder}>-</span>)
      } else {
        res.push(
          <Tooltip placement="topLeft" title={value} className={i + 1 === list.length ? styles.tableTrans : styles.tableTransBorder}>
            {value}
          </Tooltip>
        )
      }
    } else {
      console.log(value, "实际值")
      res.push(<td className={i + 1 === list.length ? styles.tableTrans : styles.tableTransBorder}>{value}</td>)
    }
  }
  return <span>{res} </span>
}

export default CusTable
