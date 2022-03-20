import { useRef, useState } from 'react';

import type { ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';

import { getInStockList } from '@/pages/InList/services';


import Payable from './Payable';
import type { PayItem, InTableListItem } from '@/pages/InList/data';
// import { transKey } from '@/utils/transKey';
import { InListColumns } from '@/pages/InList/inColumns';

export default () => {
  const [drawerVisit, setDrawerVisit] = useState(false);
  const [defaultPay, setPay] = useState<PayItem>();
  const ref = useRef<ActionType>();

  return (
    <PageContainer>
      <ProTable<InTableListItem>
        columns={InListColumns}
        // request={(params, sorter, filter) => {
        //   // 表单搜索项会从 params 传入，传递给后端接口。
        //   return Promise.resolve(getInStockList({ ...params, sorter, filter }))
        //     .then((res) => {
        //       return res
        //     })
        //     .catch((err) => {
        //       console.log(err);
        //     });
        // }}
        request={async (params = {}) => {
          // params.pageSize = 9999
          // params.current = 1
          const msg = await getInStockList({current: 1, pageSize: 10, ...params});
          return {
            data: msg.data,
            // success 请返回 true，
            // 不然 table 会停止解析数据，即使有数据
            success: msg.success,
            // 不传会使用 data 的长度，如果是分页一定要传
            total: msg.total,
          };
        }}
        rowKey="key"
        actionRef={ref}
        pagination={false}
        search={{
          layout: 'vertical',
          defaultCollapsed: false,
        }}
        dateFormatter="string"
        // rowSelection={{
        //   type: 'radio',
        //   // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
        //   // 注释该行则默认不显示下拉选项
        //   // selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE,],
        //   selectedRowKeys: selectRowKeys,
        //   onChange: handleOnSelectChange,
        // }}
        onRow={record => {
          return {
            onDoubleClick: () => {
              setPay({
                source_bill: record?.id,
                number: record?.number,
                bill_amount: record?.bill_amount,
                remain_amount: record?.remain_amount,
                status: record?.status,
              });
              setDrawerVisit(true)
            }
          };
        }}
      />
      {defaultPay?.source_bill ? (
        <Payable
          setDrawerVisit={setDrawerVisit}
          drawerVisit={drawerVisit}
          defaultPay={defaultPay}
          reload={ref.current?.reload()}
        />
      ) : (
        <></>
      )}
    </PageContainer>
  );
};
