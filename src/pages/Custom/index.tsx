import { Button, Tooltip, Dropdown, Menu, Input } from 'antd';
import { EllipsisOutlined, QuestionCircleOutlined, SearchOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';

import CreateCustom from './CreateCustom';
import CreateOrder from './CreateOrder';
import { getCustomList } from '@/pages/Custom/services';
import UpdateForm from '@/pages/TableList/components/UpdateForm';

export type TableListItem = {
  key: number;
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

const columns: ProColumns<TableListItem>[] = [
  {
    title: '排序',
    dataIndex: 'index',
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
    title: (
      <>
        创建时间
        <Tooltip placement="top" title="这是一段描述">
          <QuestionCircleOutlined style={{ marginLeft: 4 }} />
        </Tooltip>
      </>
    ),
    // width: 140,
    align: 'center',
    key: 'since',
    dataIndex: 'createdAt',
    valueType: 'date',
    sorter: (a, b) => a.createdAt - b.createdAt,
  },
  {
    title: <>最近购买时间</>,
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
    render: () => [
      <a key="link">查看</a>,
      <a key="link2">编辑</a>,
      <TableDropdown
        key="actionGroup"
        menus={[
          { key: 'copy', name: '复制' },
          { key: 'delete', name: '删除' },
          { key: 'delete', name: '禁用' },
        ]}
      />,
    ],
  },
];

const menu = (
  <Menu>
    <Menu.Item key="1">1st item</Menu.Item>
    <Menu.Item key="2">2nd item</Menu.Item>
    <Menu.Item key="3">3rd item</Menu.Item>
  </Menu>
);

export default () => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createOrderVisible, setCreateOrderVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false)

  const handleCancel = () => {
    setCreateModalVisible(false);
  };

  const handleOrderCancel = () => {
    setCreateOrderVisible(false);
  };

  return (
    <PageContainer>
      <ProTable<TableListItem>
        columns={columns}
        request={(params, sorter, filter) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          console.log(params, sorter, filter);
          return Promise.resolve(getCustomList({ sorter, filter }))
            .then((res) => {
              console.log(res, "res")
              return res;
            })
            .catch((err) => {
              console.log(err);
              alert('加载失败');
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
          </Button>,
          <Dropdown key="menu" overlay={menu}>
            <Button>
              <EllipsisOutlined />
            </Button>
          </Dropdown>,
        ]}
      />
      <CreateCustom createModalVisible={createModalVisible} onCancel={handleCancel} />
      {/*<UpdateForm onCancel={handleCancel} updateModalVisible={updateModalVisible} />*/}
      <CreateOrder createOrderVisible={createOrderVisible} onCancel={handleOrderCancel} />
    </PageContainer>
  );
};
