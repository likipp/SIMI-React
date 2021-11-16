import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { requestProduct, requestWareHouse } from '@/components/BaseBill/services';
import type { DataSourceType } from '@/pages/ExistingStock/data';
import { PageContainer } from '@ant-design/pro-layout';
import { getStockList } from '@/pages/ExistingStock/services';

export default () => {
  const columns: ProColumns<DataSourceType>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '产品代码',
      align: 'right',
      dataIndex: 'p_number',
      key: 'p_number',
      width: '15%',
      valueType: 'select',
      request: requestProduct,
    },
    {
      title: '产品名称',
      align: 'right',
      dataIndex: 'p_name',
      width: '20%',
      fieldProps: {
        precision: 2,
        min: 0,
        max: 9999,
      }
    },
    {
      title: '仓库',
      align: 'right',
      dataIndex: 'ware_house',
      valueType: 'select',
      fieldProps: {
        showArrow: false,
        showSearch: true,
      },
      request: requestWareHouse,
    },
    {
      title: '数量',
      align: 'right',
      dataIndex: 'qty',
      valueType: 'digit',
      fieldProps: {
        precision: 0,
        min: 1,
        max: 9999,
      },
    },
    // {
    //   title: '操作',
    //   valueType: 'option',
    // },
  ];
  return <PageContainer>
    <ProTable<DataSourceType>
      columns={columns}
      request={async (params, sorter, filter) => {
        // 表单搜索项会从 params 传入，传递给后端接口。
        params.pageSize = 9999
        params.current = 1
        try {
          const res = await Promise.resolve(getStockList({...params, sorter, filter }));
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].key = res.data[i].number + res.data[i].p_number + res.data[i].id;
          }
          return res;
        } catch (err) {
          console.log(err);
        }
      }}
      bordered={true}
      rowKey="key"
      pagination={false}
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
