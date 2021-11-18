import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { getExStockList } from '@/pages/ExList/services';
import type { MomentInput } from 'moment';
import moment from 'moment';
import mergeCells from '@/utils/mergeCells';
import { Link } from 'umi';
import { AlipayCircleOutlined, WechatOutlined } from '@ant-design/icons';

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
  in_discount: number;
  ex_discount: number;
  cost: number;
  profit: number;
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
        range: {
          Today: [moment(), moment()],
          'This Month': [moment().startOf('month'), moment().endOf('month')],
        },
        showTime: true
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
    valueEnum,
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

export default () => {
  return (
    <PageContainer>
      <ProTable<TableListItem>
        columns={columns}
        request={async (params, sorter, filter) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          params.pageSize = 9999
          params.current = 1
          try {
            const res = await Promise.resolve(getExStockList({...params, sorter, filter }));
            console.log(sorter, "sorter")
            for (let i = 0; i < res.data.length; i++) {
              res.data[i].key = res.data[i].number + res.data[i].p_number + res.data[i].id;
            }
            res.data = mergeCells(res.data);
            return res;
          } catch (err) {
            console.log(err);
          }
        }}
        bordered={true}
        rowKey="key"
        pagination={false}
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
        // toolbar={{
        //   actions: [
        //     <Button>删除</Button>
        //   ]
        // }}
      />
    </PageContainer>
  );
};
