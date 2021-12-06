import { PageContainer } from '@ant-design/pro-layout';
import type { InExTableListItem } from '@/pages/IEList/data';
import ProTable from '@ant-design/pro-table';
import { InExListColumns } from '@/pages/IEList/columns';
import { transKey } from '@/utils/transKey';
import { getInExStockList } from '@/pages/IEList/services';

export default () => {
  return <div>
    <PageContainer>
      <ProTable<InExTableListItem>
        columns={InExListColumns}
        request={async (params, sorter, filter) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          params.pageSize = 9999
          params.current = 1
          try {
            const res = await Promise.resolve(getInExStockList({...params, sorter, filter }));
            return transKey(res)
          } catch (err) {
            console.log(err);
          }
        }}
        pagination={false}
      />
    </PageContainer>
  </div>
}
