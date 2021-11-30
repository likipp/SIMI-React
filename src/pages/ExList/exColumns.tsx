import type { ProColumns } from '@ant-design/pro-table';
import type { ExTableListItem } from '@/pages/ExList/data';
import { Link } from 'umi';
import type { MomentInput } from 'moment';
import moment from 'moment';
import locale from 'antd/es/date-picker/locale/zh_CN';
import { AlipayCircleOutlined, WechatOutlined } from '@ant-design/icons';


export const ExListColumns: ProColumns<ExTableListItem>[] = [
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
    title: '客户',
    dataIndex: 'c_name',
    sorter: true,
    align: 'center',
    render: (value, row) => {
      return {
        children: value,
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
    title: '付款方式',
    dataIndex: 'pay_method',
    align: 'center',
    valueType: 'select',
    initialValue: 'all',
    sorter: true,
    filters: true,
    onFilter: true,
    key: 'select',
    valueEnum: {
      all: { text: '全部', status: 'Default' },
      ali: { text: '支付宝', status: 'Processing' },
      wechat: { text: '微信', status: 'Success' },
    },
    render: (value, row) => {
      return {
        children: row.pay_method == "ali" ? <AlipayCircleOutlined style={{color: '#1890ff', fontSize: '20px'}}/> : <WechatOutlined style={{color: '#52c41a', fontSize: '20px'}}/>,
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
    title: '单价',
    dataIndex: 'unit_price',
    align: 'center',
    search: false,
    valueType: 'digit',
  },
  {
    title: '数量',
    dataIndex: 'ex_qty',
    align: 'center',
    search: false,

  },
  {
    title: '售出金额',
    dataIndex: 'total',
    align: 'center',
    search: false,
    valueType: 'money',
    render: (value, row) => {
      return {
        children: <span>{row.total}</span>,
        props: {
          rowSpan: row.rowSpan,
        },
      };
    },
  },
  {
    title: '成本',
    dataIndex: 'cost',
    align: 'center',
    search: false,
    valueType: 'money',
    render: (value, row) => {
      return {
        children: <span>{row.cost}</span>,
        props: {
          rowSpan: row.rowSpan,
        },
      };
    },
  },
  {
    title: '利润',
    dataIndex: 'profit',
    align: 'center',
    search: false,
    valueType: 'money',
    render: (value, row) => {
      return {
        children: <span>{row.profit}</span>,
        props: {
          rowSpan: row.rowSpan,
        },
      };
    },
  },
];
