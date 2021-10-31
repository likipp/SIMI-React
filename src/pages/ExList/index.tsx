import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { getExStockList } from '@/pages/ExList/services';
import type { MomentInput } from 'moment';
import moment from 'moment';
import mergeCells from '@/utils/mergeCells';
import { Link } from 'umi';

export type TableListItem = {
  // 'key': number;
  number: string;
  created_at: number;
  pay_method: string;
  p_number: string;
  p_name: string;
  ex_qty: number;
  unit_price: number;
  total: number;
  rowSpan: number;
  h_discount: number;
  b_discount: number;
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
    valueType: 'dateRange',
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
    filters: true,
    onFilter: true,
    key: 'select',
    valueEnum,
    render: (value, row) => {
      return {
        // children: value === "支付宝" ? <Tag color="#2db7f5">{value}</Tag> : <Tag color="#87d068">{value}</Tag>,
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
    title: '客户折扣',
    dataIndex: 'h_discount',
    align: 'center',
    valueType: 'percent',
  },
  {
    title: '单价',
    dataIndex: 'ex_qty',
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
    title: '折上折',
    dataIndex: 'b_discount',
    align: 'center',
    valueType: 'percent',
    fieldProps: { precision: 0 },
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
          return Promise.resolve(getExStockList({ sorter, filter }))
            .then((res) => {
              res.data = mergeCells(res.data);
              return res;
            })
            .catch((err) => {
              console.log(err);
            });
        }}
        bordered={true}
        rowKey="key"
        pagination={{
          showQuickJumper: true,
        }}
        search={{
          layout: 'vertical',
          defaultCollapsed: false,
        }}
        dateFormatter="string"
        rowClassName={(record, index) => {
          let className = 'light-row';
          if (index % 2 === 1) className = 'dark-row';
          return className;
        }}
      />
    </PageContainer>
  );
};
