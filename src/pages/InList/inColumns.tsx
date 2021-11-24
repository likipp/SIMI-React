import type { ProColumns } from '@ant-design/pro-table';
import { Link } from 'umi';
import type { MomentInput } from 'moment';
import moment from 'moment';
import { Tag } from 'antd';
import type { InTableListItem } from '@/pages/InList/data';

export const InListColumns: ProColumns<InTableListItem>[] = [
  {
    title: '单号',
    dataIndex: 'number',
    align: 'center',
    sorter: true,
    width: '15px',
    render: (value, row) => {
      return {
        children: <Link to={`/inbilldetail/${value}`}>{value}</Link>,
        props: {
          rowSpan: row.rowSpan,
        },
      };
    }
  },
  {
    title: '创建时间',
    sorter: true,
    dataIndex: 'created_at',
    align: 'center',
    valueType: 'dateRange',
    render: (value, row) => {
      return {
        children: moment(row.created_at as MomentInput).format('YYYY-MM-DD HH:mm'),
        props: {
          rowSpan: row.rowSpan,
        },
      };
    },
    fieldProps: () => {
      return {
        ranges: {
          '今天': [moment(), moment()],
          '本月': [moment().startOf('month'), moment().endOf('month')],
          '本季': [moment().startOf('quarter'), moment().endOf('quarter')],
          '本年': [moment().startOf('year'), moment().endOf('year')]
        },
        showTime: true
      }
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
  },
  {
    title: '数量',
    dataIndex: 'in_qty',
    align: 'center',
    search: false,
    valueType: 'digit',
  },
  {
    title: '订单金额',
    dataIndex: 'bill_amount',
    align: 'center',
    search: false,
    valueType: 'money',
    render: (value, row) => {
      return {
        children: <span>{row.bill_amount}</span>,
        props: {
          rowSpan: row.rowSpan,
        },
      };
    },
  },
  {
    title: '已付金额',
    dataIndex: 'remain_amount',
    align: 'center',
    search: false,
    valueType: 'money',
    render: (value, row) => {
      return {
        children: <span>{row.remain_amount}</span>,
        props: {
          rowSpan: row.rowSpan,
        },
      };
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    filters: true,
    onFilter: true,
    align: 'center',
    valueType: 'radio',
    valueEnum: {
      0: { text: '欠款中', status: 'Processing' },
      1: { text: '结清', status: 'Success' },
    },
    render: (value, row) => {
      return {
        children: row.status == 1 ? <Tag color="green">已结清</Tag> : <Tag color="red">欠款中</Tag>,
        props: {
          rowSpan: row.rowSpan,
        },
      };
    },
  },
];


