import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import type { MomentInput } from 'moment';
import moment from 'moment';
import { getInStockList } from '@/pages/InList/services';
import mergeCells from '@/utils/mergeCells';
import { Link } from 'umi';

export type TableListItem = {
  number: string;
  created_at: number;
  pay_method: string;
  p_number: string;
  p_name: string;
  in_qty: number;
  unit_price: number;
  total: number;
  rowSpan: number;
};

const valueEnum = {
  all: { text: '全部', status: 'Default' },
  ali: { text: '支付宝', status: 'Processing' },
  wechat: { text: '微信', status: 'Success' },
};

const columns: ProColumns<TableListItem>[] = [
  {
    title: '单号',
    dataIndex: 'number',
    align: 'center',
    render: (value, row) => {
      return {
        children: <Link to={`/inbilldetail/${value}`}>{value}</Link>,
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
    valueType: 'dateRange',
    render: (value, row) => {
      return {
        children: moment(value as MomentInput).format('YYYY-MM-DD HH:mm'),
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
    filters: true,
    onFilter: true,
    key: 'select',
    valueEnum,
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
    dataIndex: 'in_qty',
    align: 'center',
    search: false,
  },
  {
    title: '数量',
    dataIndex: 'unit_price',
    align: 'center',
    search: false,
    valueType: 'digit',
  },
  {
    title: '金额',
    dataIndex: 'total',
    align: 'center',
    search: false,
    valueType: 'money',
  },
];

export default () => {
  return (
    <PageContainer>
      <ProTable<TableListItem>
        columns={columns}
        request={(params, sorter, filter) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          return Promise.resolve(getInStockList({ sorter, filter }))
            .then((res) => {
              res.data = mergeCells(res.data);
              return res;
            })
            .catch((err) => {
              console.log(err);
            });
        }}
        rowKey="key"
        pagination={{
          showQuickJumper: true,
        }}
        search={{
          layout: 'vertical',
          defaultCollapsed: false,
        }}
        dateFormatter="string"
      />
    </PageContainer>
  );
};
