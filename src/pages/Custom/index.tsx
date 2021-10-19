import { Button, Tooltip, Dropdown, Menu, Input } from 'antd';
import { EllipsisOutlined, QuestionCircleOutlined, SearchOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';

import CreateCustom from './CreateCustom';
import CreateOrder from './CreateOrder';
import { getCustomList } from '@/pages/Custom/services';

const valueEnum = {
  0: 'close',
  1: 'running',
  2: 'online',
  3: 'error',
};

export type TableListItem = {
  key: number;
  name: string;
  containers: number;
  creator: string;
  status: string;
  createdAt: number;
  boughtAt: number;
  progress: number;
  money: number;
  memo: string;
};
const tableListDataSource: TableListItem[] = [];

const creators = ['付小小', '曲丽丽', '林东东', '陈帅帅', '兼某某'];

for (let i = 0; i < 5; i += 1) {
  tableListDataSource.push({
    key: i,
    name: 'AppName',
    containers: Math.floor(Math.random() * 20),
    creator: creators[Math.floor(Math.random() * creators.length)],
    status: valueEnum[Math.floor(Math.random() * 10) % 4],
    createdAt: Date.now() - Math.floor(Math.random() * 2000),
    boughtAt: Date.now() - Math.floor(Math.random() * 2000),
    money: Math.floor(Math.random() * 2000) * i,
    progress: Math.ceil(Math.random() * 100) + 1,
    memo: i % 2 === 1 ? '很长很长很长很长很长很长很长的文字要展示但是要留下尾巴' : '简短备注文案',
  });
}

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
  // {
  //   title: '创建者',
  //   dataIndex: 'creator',
  //   valueEnum: {
  //     all: { text: '全部' },
  //     付小小: { text: '付小小' },
  //     曲丽丽: { text: '曲丽丽' },
  //     林东东: { text: '林东东' },
  //     陈帅帅: { text: '陈帅帅' },
  //     兼某某: { text: '兼某某' },
  //   },
  // },
  {
    title: '等级',
    dataIndex: 'level',
    initialValue: 'all',
    filters: true,
    onFilter: true,
    width: 140,
    valueEnum: {
      all: { text: '全部', status: 'Default' },
      close: { text: '零售客户', status: 'Default' },
      running: { text: 'VIP代理', status: 'Processing' },
      online: { text: '区域代理', status: 'Success' },
      error: { text: '特约代理', status: 'Error' },
      total: { text: '总代理', status: 'Error' },
    },
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
    width: 140,
    key: 'since',
    dataIndex: 'createdAt',
    valueType: 'date',
    sorter: (a, b) => a.createdAt - b.createdAt,
  },
  {
    title: <>最近购买时间</>,
    width: 140,
    key: 'since',
    dataIndex: 'boughtAt',
    valueType: 'date',
    sorter: (a, b) => a.createdAt - b.createdAt,
  },
  {
    title: '备注',
    dataIndex: 'memo',
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
              return res;
            })
            .catch((err) => {
              console.log(err)
              alert("加载失败");
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
      <CreateOrder createOrderVisible={createOrderVisible} onCancel={handleOrderCancel} />
    </PageContainer>
  );
};
