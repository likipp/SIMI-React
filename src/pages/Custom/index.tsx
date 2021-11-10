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
import { requestCustomLevelSelectList } from '@/components/BaseBill/services';

export type TableListItem = {
  id: number;
  c_name: string;
  c_number: string;
  createdAt: number;
  boughtAt: number;
  level: number;
  level_id: number;
  mark: string;
  phone: string;
  address: string;
};
// const tableListDataSource: TableListItem[] = [];



export default () => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createOrderVisible, setCreateOrderVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false)
  const [data, setData] = useState([])
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
      filters: true,
      onFilter: true,
      valueType: 'select',
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '客户等级必填' }],
        };
      },
      fieldProps: {
        showArrow: false,
        showSearch: true,
      },
      request: requestCustomLevelSelectList,
    },
    {
      title: '手机号码',
      align: 'center',
      dataIndex: 'phone',
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
      key: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a key="editable"
           onClick={() => {
             setUpdateModalVisible(true)
             setData(record)
           }}
        >编辑</a>,
      ],
    },
  ];

  const handleCancel = () => {
    setCreateModalVisible(false);
    actionRef.current?.reset?.()
  };

  const handleUpdateFormCancel = () => {
    setUpdateModalVisible(false)
    setData([])
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
      <CreateCustom createModalVisible={createModalVisible} onCancel={handleCancel} reload={actionRef.current?.reload}/>
      <UpdateCustom onCancel={handleUpdateFormCancel} updateModalVisible={updateModalVisible} data={data} reload={actionRef.current?.reload}/>
      <CreateOrder createOrderVisible={createOrderVisible} onCancel={handleOrderCancel} />
    </PageContainer>
  );
};
