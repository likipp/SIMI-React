import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { getProductList } from '@/pages/Product/services';
import {
  requestUnitSelectList,
  requestBrandSelectList,
  requestWareHouse,
} from '@/components/BaseBill/services';
import type { ProductListItem, ProductQueryParams } from '@/pages/Product/data';
import CreateProduct from '@/pages/Product/CreateProduct';
import UpdateProduct from '@/pages/Product/UpdateProduct'
import { useState, useRef, useEffect } from 'react';
import { Button } from 'antd';
import BrandTree from '@/pages/Brand/Tree';
import CSelect from '@/components/CSelect/CSelect';
import type { ProFormInstance } from '@ant-design/pro-form';
import styles from '@/pages/Product/styles.less'

export default () => {
  const actionRef = useRef<ActionType>();
  const ref = useRef<ProFormInstance>();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [data, setData] = useState<ProductListItem>()
  const [copy, setCopy] = useState("编辑")
  const [brand, setBrand] = useState(0)
  const [display, setDisplay] = useState('none')

  const columns: ProColumns<ProductListItem>[] = [
    {
      title: '排序',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '图片',
      align: 'center',
      dataIndex: 'picture',
      key: 'picture',
      valueType: 'image',
      onCell: () => {
        return {
          className: styles.cellPicture,
        }
      }
    },
    {
      title: '产品代码',
      dataIndex: 'p_number',
      align: 'center',
      // fieldProps: productColumn,
      render: (_, record) => {
        return <span>{record.p_number}</span>
      },
      renderFormItem: () => <CSelect />,
      // request: requestProduct,
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
      hideInSearch: true
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
      title: '采购价格',
      dataIndex: 'purchase_price',
      align: 'center',
      valueType: 'money'
    },
    {
      title: '销售价格',
      dataIndex: 'sale_price',
      align: 'center',
      valueType: 'money'
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      render: (text, record) => [
        <a
          key="editable"
          onClick={() => {
            // action?.startEditable?.(record.id);
            setUpdateModalVisible(true)
            setCopy("编辑")
            const temp = JSON.parse(JSON.stringify(record))
            temp.picture = {
              name: temp.picture.split("/")[temp.picture.split("/").length - 1],
              status: 'done',
              url: temp.picture
            }
            setData(temp)
          }}
        >
          编辑
        </a>,
        <a
          key="copy"
          onClick={() => {
            setUpdateModalVisible(true)
            setCopy("新建")
            const temp = JSON.parse(JSON.stringify(record))
            temp.picture = {
              name: temp.picture.split("/")[temp.picture.split("/").length - 1],
              status: 'done',
              url: temp.picture
            }
            setData(temp)
          }}
        >
          复制
        </a>

      ],
    },
  ]

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
    if (brand !== 0) {
      if (ref.current) {
        // ref.current.setFieldsValue({
        //   brand: brand.toString(),
        // });
      }
      setDisplay('block')
    } else {
      setDisplay('none')
    }
  }, [brand])
  return (
    <PageContainer>
      <ProTable<ProductListItem, ProductQueryParams>
        columns={columns}
        actionRef={actionRef}
        // editable={{
        //   type: 'multiple'
        // }}
        rowKey="id"
        request={(params, sorter, filter) => {
          // if (params.p_number) {
          //   params.p_number = params.p_number.value
          // }
          if (brand) {
            params.brand = brand
          }
          // if (params.brand) {
          //   params.brand = parseInt(params.brand)
          // }
          // return Promise.resolve(getProductList({...params, sorter, filter}))
          //   .then((res) => {
          //     for (let i = 0; i < res.data.length; i++) {
          //       res.data[i].key = res.data[i].p_number
          //     }
          //     return res
          //   })
         return getProductList({...params}).then((res) => {
           for (let i = 0; i < res.data.length; i++) {
             res.data[i].key = res.data[i].p_number
           }
           return res
         })
        }}
      //   request={getProductList}
      //   formRef={ref}
        toolBarRender={() => [
          <div style={{display: display}}>
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                setCreateModalVisible(true);
              }}
            >
              新建
            </Button>
          </div>
        ]}
        tableRender={(_, dom) => (
          <div
            style={{
              display: 'flex',
              width: '100%',
              marginRight: '15px'
            }}
          >
            <BrandTree set={setBrand}/>
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
        pagination={{
          pageSize: 5,
        }}
      />
      {
        createModalVisible ? <CreateProduct createModalVisible={createModalVisible} onCancel={handleCancel} reload={actionRef.current?.reload} brand={brand}/>
          : <></>
      }
      {
        data ? <UpdateProduct updateModalVisible={updateModalVisible} onCancel={handleUpdateCancel} reload={actionRef.current?.reload} data={data} copy={copy}/>
          : <></>
      }
    </PageContainer>
  )
}
