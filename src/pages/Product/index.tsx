import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { getProductList } from '@/pages/Product/services';
import {
  requestUnitSelectList,
  requestBrandSelectList,
  requestWareHouse,
  requestProduct,
} from '@/components/BaseBill/services';
import type { ProductListItem } from '@/pages/Product/data';
import CreateProduct from '@/pages/Product/CreateProduct';
import UpdateProduct from '@/pages/Product/UpdateProduct'
import React, { useState, useRef, useEffect } from 'react';
import { Badge, Button } from 'antd';
import BrandTree from '@/pages/Brand/Tree';
import productColumn from '@/pages/Product/productColumn';



export default () => {
  const actionRef = useRef<ActionType>();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [data, setData] = useState<ProductListItem>()
  const [copy, setCopy] = useState("编辑")
  const [brand, setBrand] = useState(0)
  const [activeKey, setActiveKey] = useState<React.Key>('tab1');
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
      fieldProps: productColumn,
      render: (_, record) => {
        return <span>{record.p_number}</span>
      },
      request: requestProduct,
    },
    {
      title: '产品名称',
      dataIndex: 'p_name',
      align: 'center',
    },
    {
      title: '规格',
      dataIndex: 'p_spec',
      align: 'center',
    },
    {
      title: '仓库',
      dataIndex: 'ware_house',
      align: 'center',
      valueType: 'select',
      hideInSearch: true,
      filters: true,
      onFilter: true,
      request: requestWareHouse
    },
    {
      title: '品牌',
      dataIndex: 'brand',
      align: 'center',
      valueType: 'select',
      filters: true,
      onFilter: true,
      request: requestBrandSelectList
    },
    {
      title: '单位',
      dataIndex: 'unit',
      align: 'center',
      valueType: 'select',
      filters: true,
      onFilter: true,
      request: requestUnitSelectList
    },
    {
      title: '价格',
      dataIndex: 'p_price',
      align: 'center',
      valueType: 'money'
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record) => [
        <a
          key="editable"
          onClick={() => {
            // action?.startEditable?.(record.id);
            setUpdateModalVisible(true)
            setData(record)
          }}
        >
          编辑
        </a>,
        <a
          key="copy"
          onClick={() => {
            setUpdateModalVisible(true)
            setCopy("新建")
            setData(record)
          }}
        >
          复制
        </a>

      ],
    },
  ]

  const renderBadge = (count: number, active = false) => {
    return (
      <Badge
        count={count}
        style={{
          marginTop: -2,
          marginLeft: 4,
          color: active ? '#1890FF' : '#999',
          backgroundColor: active ? '#E6F7FF' : '#eee',
        }}
      />
    );
  };


  const handleCancel = () => {
    setCreateModalVisible(false);
  };

  const handleUpdateCancel = () => {
    setUpdateModalVisible(false)
    setData(() => {
      return undefined
    })
  }

  useEffect(() => {
    actionRef.current?.reload()
  }, [brand])
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
          return Promise.resolve(getProductList({...params, brand: brand, sorter, filter}))
            .then((res) => {
              for (let i = 0; i < res.data.length; i++) {
                res.data[i].key = res.data[i].p_number
              }
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
              marginRight: '15px'
            }}
          >
            <BrandTree brand={brand} reload={actionRef.current?.reload} set={setBrand}/>
            <div
              style={{
                flex: 1,
                marginRight: '15px'
              }}
            >
              {dom}
            </div>
          </div>
        )}
        toolbar={{
          menu: {
            type: 'tab',
            activeKey: activeKey,
            items: [
              {
                key: 'tab1',
                label: <span>应用{renderBadge(99, activeKey === 'tab1')}</span>,
              },
              {
                key: 'tab2',
                label: <span>项目{renderBadge(30, activeKey === 'tab2')}</span>,
              },
              {
                key: 'tab3',
                label: <span>文章{renderBadge(30, activeKey === 'tab3')}</span>,
              },
            ],
            onChange: (key) => {
              setActiveKey(key as string);
            },
          },
        }}
        pagination={{
          pageSize: 10,
        }}
      />
      <CreateProduct createModalVisible={createModalVisible} onCancel={handleCancel} reload={actionRef.current?.reload} />
      {
        data ? <UpdateProduct updateModalVisible={updateModalVisible} onCancel={handleUpdateCancel} reload={actionRef.current?.reload} data={data} copy={copy}/>
          : <></>
      }
    </PageContainer>
  )
}
