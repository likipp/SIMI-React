import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import type { MomentInput } from 'moment';
import moment from 'moment';
import { getInStockList } from '@/pages/InList/services';
import mergeCells from '@/utils/mergeCells';
import { Link } from 'umi';
import { Button } from 'antd';
import { useState } from 'react';
import Payable from './Payable'

export type TableListItem = {
  number: string;
  created_at: number;
  pay_method: string;
  p_number: string;
  p_name: string;
  in_qty: number;
  unit_price: number;
  bill_amount: number;
  remain_amount: number;
  rowSpan: number;
  status: number;
};

export type PayItem = {
  source_bill: number;
  bill_amount: number;
  remain_amount: number;
  number: string;
  status: number;
}

const valueEnum = {
  all: { text: '全部', status: 'Default' },
  ali: { text: '支付宝', status: 'Processing' },
  wechat: { text: '微信', status: 'Success' },
};

const valueStatusEnum = {
  0: {text: '欠款中', status: 'Processing'},
  1: {text: '结清', status: 'Success'}
}

const columns: ProColumns<TableListItem>[] = [
  // {
  //   title: '序号',
  //   dataIndex: 'key',
  //   // valueType: 'indexBorder',
  //   width: 48,
  // },
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
    title: '订单金额',
    dataIndex: 'bill_amount',
    align: 'center',
    search: false,
    valueType: 'money',
  },
  {
    title: '已付金额',
    dataIndex: 'remain_amount',
    align: 'center',
    search: false,
    valueType: 'money',
  },
  {
    title: '状态',
    dataIndex: 'status',
    align: 'center',
    valueType: 'radio',
    valueEnum: valueStatusEnum
  },
];

export default () => {
  const [drawerVisit, setDrawerVisit] = useState(false);
  const [selectRowKeys, setSelectRowKeys] = useState([])
  const [defaultPay, setPay] = useState<PayItem>()
  const [displayButton, setDisplayButton] = useState(true)

  const handleOnSelectChange = (selectedRowKeys: any, selectedRows: any) => {
    // console.log(selectedRowKeys, "selectedRowKeys")
    console.log(selectedRows[0]?.bill_amount, "status")
    setPay({source_bill: selectedRows[0]?.id, number: selectedRows[0]?.number, bill_amount: selectedRows[0]?.bill_amount, remain_amount: selectedRows[0]?.remain_amount, status: selectedRows[0]?.status})
    setSelectRowKeys(selectedRowKeys)
    if (selectedRows[0]?.status || selectedRows[0]?.status == undefined) {
      return
    }
    setDisplayButton(false)

  }

  return (
    <PageContainer>
      <ProTable<TableListItem>
        columns={columns}
        request={(params, sorter, filter) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          return Promise.resolve(getInStockList({ sorter, filter }))
            .then((res) => {
              for (let i = 0; i < res.data.length; i++) {
                res.data[i].key = res.data[i].id
              }
              res.data = mergeCells(res.data);

              return res;
            })
            .catch((err) => {
              console.log(err);
            });
        }}
        rowKey="key"
        pagination={false}
        search={{
          layout: 'vertical',
          defaultCollapsed: false,
        }}
        dateFormatter="string"
        toolBarRender={() => [
          <Button key="danger" danger
            // hidden={displayButton}
            onClick={() => {
              setDrawerVisit(true);
            }}
          >
            应付单
          </Button>
        ]}
        rowSelection={{
          type: "checkbox",
          // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
          // 注释该行则默认不显示下拉选项
          // selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE,],
          selectedRowKeys: selectRowKeys,
          onChange: handleOnSelectChange,
        }}
      />
      <span>{defaultPay?.source_bill}</span>
      {

        defaultPay?.source_bill ? <Payable  setDrawerVisit={setDrawerVisit} drawerVisit={drawerVisit} defaultPay={defaultPay} />
        : <></>
      }

    </PageContainer>
  );
};
