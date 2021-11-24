import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { getExStockList } from '@/pages/ExList/services';
import type { ExTableListItem } from '@/pages/ExList/data';
import { ExListColumns } from '@/pages/ExList/exColumns';
import { transKey } from '@/utils/transKey';


export default () => {
  return (
    <PageContainer>
      <ProTable<ExTableListItem>
        columns={ExListColumns}
        request={async (params, sorter, filter) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          params.pageSize = 9999
          params.current = 1
          try {
            const res = await Promise.resolve(getExStockList({...params, sorter, filter }));
            return transKey(res)
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
  );
};
