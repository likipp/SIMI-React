import { Button, Input, Table } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';

import CreateCustom from './CreateCustom';
import CreateOrder from './CreateOrder';
import { getCustomList } from '@/pages/Custom/services';
import UpdateCustom from '@/pages/Custom/UpdateCustom';

export type TableListItem = {
  id: number;
  c_name: string;
  c_number: string;
  createdAt: number;
  boughtAt: number;
  level: number;
  mark: string;
  phone: string;
  address: string;
};
// const tableListDataSource: TableListItem[] = [];



export default () => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createOrderVisible, setCreateOrderVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false)
  const [id, setID] = useState(0)
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '排序',
      dataIndex: 'key',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '客户名称',
      dataIndex: 'c_name',
      align: 'center',
      width: 200,
      render: (_) => <a>{_}</a>,
      // 自定义筛选项功能具体实现请参考 https://ant.design/components/table-cn/#components-table-demo-custom-filter-panel
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Input style={{ width: 188, marginBottom: 8, display: 'block' }} />
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
    },
    {
      title: '等级',
      dataIndex: 'level_name',
      align: 'center',
      initialValue: 'all',
      filters: true,
      onFilter: true,
      // width: 140,
      // valueEnum: {
      //   all: { text: '全部', status: 'Default' },
      //   close: { text: '零售客户', status: 'Default' },
      //   running: { text: 'VIP代理', status: 'Processing' },
      //   online: { text: '区域代理', status: 'Success' },
      //   error: { text: '特约代理', status: 'Error' },
      //   total: { text: '总代理', status: 'Error' },
      // },
    },
    {
      title: '创建时间',
      // width: 140,
      align: 'center',
      key: 'since',
      dataIndex: 'createdAt',
      valueType: 'date',
      sorter: (a, b) => a.createdAt - b.createdAt,
    },
    {
      title: '最近购买时间',
      // width: 140,
      align: 'center',
      key: 'since',
      dataIndex: 'boughtAt',
      valueType: 'date',
      sorter: (a, b) => a.createdAt - b.createdAt,
    },
    {
      title: '备注',
      align: 'center',
      dataIndex: 'mark',
      ellipsis: true,
      copyable: true,
    },
    {
      title: '操作',
      width: 180,
      key: 'option',
      valueType: 'option',
      render: (text, record) => [
        <a key="link">查看</a>,
        <a key="link2"
           onClick={() => {
             setID(record.id)
             setUpdateModalVisible(true)
           }}
        >编辑</a>,
      ],
    },
  ];

  const handleCancel = () => {
    setCreateModalVisible(false);
  };

  const handleUpdateFormCancel = () => {
    setUpdateModalVisible(false)
    setID(0)
  }

  const handleOrderCancel = () => {
    setCreateOrderVisible(false);
  };

  return (
    <PageContainer>
      <ProTable<TableListItem>
        columns={columns}
        actionRef={actionRef}
        request={(params, sorter, filter) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          return Promise.resolve(getCustomList({ sorter, filter }))
            .then((res) => {
              const result = res
              for (let i = 0; i < result.data.length; i++) {
                result.data[i].key = result.data[i].id
              }
              console.log(result.data, result.data)
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
        toolbar={{
          title: '客户列表',
          tooltip: '这是一个标题提示',
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setCreateModalVisible(true);
            }}
          >
            新建
          </Button>,
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setCreateOrderVisible(true);
            }}
          >
            新建订单
          </Button>
        ]}
        rowSelection={{
          // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
          // 注释该行则默认不显示下拉选项
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE,],
        }}
      />
      <CreateCustom createModalVisible={createModalVisible} onCancel={handleCancel} />
      {
        id > 0 ? <UpdateCustom onCancel={handleUpdateFormCancel} updateModalVisible={updateModalVisible} id={id}/>
          : <></>
      }
      <CreateOrder createOrderVisible={createOrderVisible} onCancel={handleOrderCancel} />
    </PageContainer>
  );
};
