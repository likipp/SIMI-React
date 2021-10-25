import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { getExStockList } from '@/pages/ExList/services';
import type { MomentInput } from 'moment';
import moment from 'moment';

export type TableListItem = {
  // 'key': number;
  'number': string;
  'created_at': number;
  'pay_method': string;
  'p_number': string;
  'p_name': string;
  'ex_qty': number;
  'unit_price': number;
  'total': number
  'rowSpan': number
}

// const renderContent = (value: any, row: any, index: number) => {
//   const obj = {
//     children: value,
//     props: {},
//   };
//   if (index === 4) {
//     obj.props.colSpan = 0;
//   }
//   return obj;
// };
const valueEnum = {
  all: { text: '全部', status: 'Default' },
  支付宝: { text: '支付宝', status: 'Processing' },
  微信: { text: '微信', status: 'Success' },
};


const columns: ProColumns<TableListItem>[]= [
  {
    title: '单号',
    dataIndex: 'number',
    align: 'center',
    render: (value, row) => {
      return {
        children: value,
        props: {
          rowSpan: row.rowSpan,
        }
      }
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
        }
      }
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
        }
      }
    },
  },
  // {
  //   title: '付款方式',
  //   dataIndex: 'pay_method',
  //   align: 'center',
  //   render: (value, row) => {
  //     console.log(value)
  //     return {
  //       children: value === "支付宝" ? <Tag color="#2db7f5">{value}</Tag> : <Tag color="#87d068">{value}</Tag>,
  //       props: {
  //         rowSpan: row.rowSpan,
  //       },
  //     }
  //   },
  // },
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
      console.log(value)
      return {
        // children: value === "支付宝" ? <Tag color="#2db7f5">{value}</Tag> : <Tag color="#87d068">{value}</Tag>,
        children: value,
        props: {
          rowSpan: row.rowSpan,
        },
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
    dataIndex: 'ex_qty',
    align: 'center',
    search: false
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
  }
];

const mergeCells = (data: any[]) => {
  return data.reduce((result, item) => {
    //首先将name字段作为新数组result取出
    if (result.indexOf(item.number) < 0) {
      result.push(item.number)
    }
    return result
  }, []).reduce((result: any[], name: any) => {
    //将name相同的数据作为新数组取出，并在其内部添加新字段**rowSpan**
    const children = data.filter(item => item.number === name);
    const results = result.concat(
      children.map((item, index) => ({
        ...item,
        rowSpan: index === 0 ? children.length : 0,//将第一行数据添加rowSpan字段
      })),
    );
    return results;
  }, [])
}

export default () => {
  return <PageContainer>
    <ProTable<TableListItem>
      columns={columns}
      request={(params, sorter, filter) => {
        // 表单搜索项会从 params 传入，传递给后端接口。
        console.log(params, sorter, filter);
        return Promise.resolve(getExStockList({sorter, filter}))
          .then((res) => {
            res.data = mergeCells(res.data)
            return res
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
}

