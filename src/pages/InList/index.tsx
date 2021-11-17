import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import type { MomentInput } from 'moment';
import moment from 'moment';
import { getInStockList } from '@/pages/InList/services';
import mergeCells from '@/utils/mergeCells';
import { Link } from 'umi';
import { Tag } from 'antd';
import { useEffect, useRef, useState } from 'react';
import Payable from './Payable';

export type TableListItem = {
  id: number;
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
};

const valueStatusEnum = {
  0: { text: '欠款中', status: 'Processing' },
  1: { text: '结清', status: 'Success' },
};



export default () => {
  const [drawerVisit, setDrawerVisit] = useState(false);
  const [defaultPay, setPay] = useState<PayItem>();
  // const [id, setID] = useState(0)
  const ref = useRef<ActionType>();

  const columns: ProColumns<TableListItem>[] = [
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
      },
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
      valueEnum: valueStatusEnum,
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

  useEffect(() => {
    ref.current?.reload()
  }, [drawerVisit])

  return (
    <PageContainer>
      <ProTable<TableListItem>
        columns={columns}
        request={(params, sorter, filter) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          return Promise.resolve(getInStockList({ ...params, sorter, filter }))
            .then((res) => {
              for (let i = 0; i < res.data.length; i++) {
                res.data[i].key = res.data[i].number + res.data[i].p_number + res.data[i].id;
              }
              res.data = mergeCells(res.data);
              return res;
            })
            .catch((err) => {
              console.log(err);
            });
        }}
        rowKey="key"
        actionRef={ref}
        pagination={false}
        search={{
          layout: 'vertical',
          defaultCollapsed: false,
        }}
        dateFormatter="string"
        // rowSelection={{
        //   type: 'radio',
        //   // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
        //   // 注释该行则默认不显示下拉选项
        //   // selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE,],
        //   selectedRowKeys: selectRowKeys,
        //   onChange: handleOnSelectChange,
        // }}
        onRow={record => {
          return {
            onClick: () => {
              console.log(record.id, record.number)
              // setID(record.id)
              console.log("点击行")

            }, // 点击行
            onDoubleClick: () => {
              setPay({
                source_bill: record?.id,
                number: record?.number,
                bill_amount: record?.bill_amount,
                remain_amount: record?.remain_amount,
                status: record?.status,
              });
              setDrawerVisit(true)
            }
          };
        }}
        // toolBarRender={() => [
        //   <Button key="primary" type="primary"
        //     onClick={() => {
        //       console.log("...", id)
        //       deleteBill(id).then(() => {
        //         console.log("删除成功")
        //       })
        //     }}
        //   >
        //     删除
        //   </Button>,
        // ]}
      />
      {defaultPay?.source_bill ? (
        <Payable
          setDrawerVisit={setDrawerVisit}
          drawerVisit={drawerVisit}
          defaultPay={defaultPay}
        />
      ) : (
        <></>
      )}
    </PageContainer>
  );
};
