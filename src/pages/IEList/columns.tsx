import type { ProColumns } from '@ant-design/pro-table';
import { Link } from 'umi';
import type { MomentInput } from 'moment';
import moment from 'moment';
import locale from 'antd/es/date-picker/locale/zh_CN';
import type { InExTableListItem } from '@/pages/IEList/data';
import { requestWareHouse } from '@/components/BaseBill/services';

export const InExListColumns: ProColumns<InExTableListItem>[] = [
  {
    title: '单号',
    dataIndex: 'number',
    align: 'center',
    width: '15px',
    render: (value, row) => {
      return {
        children: <Link to={`/exbilldetail/${value}`}>{value}</Link>,
      props: {
        rowSpan: row.rowSpan,
      },
    };
    },
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    align: 'center',
    sorter: true,
    valueType: 'dateRange',
    fieldProps: () => {
      return {
        ranges: {
          zh_Today: [moment(), moment()],
          zh_Week: [moment().startOf('week'), moment().endOf('week')],
          zh_Month: [moment().startOf('month'), moment().endOf('month')],
          zh_Season: [moment().startOf('quarter'), moment().endOf('quarter')],
          zh_Year: [moment().startOf('year'), moment().endOf('year')]
        },
        showTime: true,
        local: locale
      }
    },
    render: (value, row) => {
      return {
        children: moment(row.created_at as MomentInput).format('YYYY-MM-DD HH:mm'),
        props: {
          rowSpan: row.rowSpan,
        },
      };
    },
  },
  {
    title: '产品代码',
    dataIndex: 'p_number',
    align: 'center',
  },
  {
    title: '产品名称',
    dataIndex: 'p_name',
    align: 'center',
  },
  {
    title: '仓库',
    dataIndex: 'ware_house',
    valueType: 'select',
    formItemProps: () => {
      return {
        rules: [{ required: true, message: '仓库必填' }],
      };
    },
    fieldProps: () => {
      return {
        showArrow: false,
        showSearch: true,
      }
    },
    request: requestWareHouse,
  },
  {
    title: '出库',
    children: [
      {
        title: '数量',
        dataIndex: 'ex_qty',
        align: 'center',
        search: false,
        render: (value, row) => {
          if (row.ex_qty) {
            return (<span style={{color: '#73d13d'}}>+{row.ex_qty}</span>)
          } else {
            return <></>
          }
        }
      },
      {
        title: '单价',
        dataIndex: 'unit_price',
        align: 'center',
        search: false,
        valueType: 'digit',
        render: (value, row) => {
          if (row.ex_qty) {
            return (<span>{row.unit_price}</span>)
          } else {
            return <></>
          }
        }
      },
      {
        title: '折扣',
        dataIndex: 'ex_discount',
        align: 'center',
        search: false,
        render: (value, row) => {
          if (row.ex_qty) {
            return (<span>{row.ex_discount}%</span>)
          } else {
            return <></>
          }
        }
      },
      {
        title: '金额',
        dataIndex: 'total',
        align: 'center',
        search: false,
        valueType: 'money',
        render: (value, row) => {
          if (row.ex_qty) {
            return (<span>{row.total}</span>)
          } else {
            return <></>
          }
        }
      },
    ]
  },
  {
    title: '入库',
    children: [
      {
        title: '数量',
        dataIndex: 'in_qty',
        align: 'center',
        search: false,
        render: (value, row) => {
          if (row.in_qty) {
            return (<span style={{color: 'red'}}>-{row.in_qty}</span>)
          } else {
            return <></>
          }
        }
      },
      {
        title: '单价',
        dataIndex: 'unit_price',
        align: 'center',
        search: false,
        valueType: 'digit',
        render: (value, row) => {
          if (row.in_qty) {
            return (<span>{row.unit_price}</span>)
          } else {
            return <></>
          }
        }
      },
      {
        title: '折扣',
        dataIndex: 'in_discount',
        align: 'center',
        search: false,
        render: (value, row) => {
          if (row.in_qty) {
            return (<span>{row.in_discount}%</span>)
          } else {
            return <></>
          }
        }
      },
      {
        title: '金额',
        dataIndex: 'total',
        align: 'center',
        search: false,
        valueType: 'money',
        render: (value, row) => {
          if (row.in_qty) {
            return (<span>{row.total}</span>)
          } else {
            return <></>
          }
        }
      },
    ]
  }
];
