import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { getProductList } from '@/pages/Product/services';
import { requestUnitSelectList, requestBrandSelectList } from '@/components/BaseBill/services';
import type { ProductListItem } from '@/pages/Product/data';
import CreateProduct from '@/pages/Product/CreateProduct';
import { useState, useRef } from 'react';
import { Button } from 'antd';
import BrandTree from '@/pages/Brand/Tree';



export default () => {
  const actionRef = useRef<ActionType>();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const columns: ProColumns<ProductListItem>[] = [
    {
      title: '排序',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '产品代码',
      dataIndex: 'p_number',
      align: 'center',
      width: 200,
    },
    {
      title: '产品名称',
      dataIndex: 'p_name',
      align: 'center',
      width: 200,
    },
    {
      title: '规格',
      dataIndex: 'p_spec',
      align: 'center',
      width: 200,
    },
    {
      title: '品牌',
      dataIndex: 'brand',
      align: 'center',
      width: 200,
      valueType: 'select',
      request: requestBrandSelectList
    },
    {
      title: '单位',
      dataIndex: 'unit',
      align: 'center',
      width: 200,
      valueType: 'select',
      request: requestUnitSelectList
    },
    {
      title: '价格',
      dataIndex: 'price',
      align: 'center',
      width: 200,
      valueType: 'money'
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
            console.log(text, "text")
            console.log(record, "record")
            console.log(action, "action")
          }}
        >
          编辑
        </a>,
        <a target="_blank" rel="noopener noreferrer" key="view">
          查看
        </a>
      ],
    },
  ]

  const handleCancel = () => {
    setCreateModalVisible(false);
  };
  return (
    <PageContainer>
      <ProTable<ProductListItem>
        columns={columns}
        actionRef={actionRef}
        editable={{
          type: 'multiple'
        }}
        rowKey="id"
        request={(params, sorter, filter) => {
          return Promise.resolve(getProductList({sorter, filter}))
            .then((res) => {
              return res
            })
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
          </Button>
        ]}
        tableRender={(_, dom) => (
          <div
            style={{
              display: 'flex',
              width: '100%',
            }}
          >
            <BrandTree/>
            <div
              style={{
                flex: 1,
              }}
            >
              {dom}
            </div>
          </div>
        )}
      />
      <CreateProduct createModalVisible={createModalVisible} onCancel={handleCancel} />
    </PageContainer>
  )
}
