import HeaderBillDetail from '@/components/HeaderBillDetail';
import ProForm, { ProFormDatePicker, ProFormText } from '@ant-design/pro-form';
import type { ExSourceType, InSourceType } from '@/pages/ExBillDetail/data';
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import summary from '@/utils/summary';

interface BillReadOnlyProps {
  data: InSourceType
  columns: ProColumns<InSourceType>[] | ProColumns<ExSourceType>[];
}

const BillReadOnly = (props: BillReadOnlyProps) => {
  const {columns, data} = props

  return data ? <div>
      <HeaderBillDetail number={data.bill_number} type={"in"}/>
      <ProForm<InSourceType>
        submitter={{
          render: () => {
            return [];
          },
        }}
      >
        <ProForm.Group>
          <ProFormText width="sm" name="bill_number" label="单据编号" disabled={true} initialValue={data.bill_number}/>
          <ProFormDatePicker
            name="created_at"
            label="单据日期"
            initialValue={data.createdAt}
            disabled={true}
          />
        </ProForm.Group>
        <ProForm.Item
          name="body"
        >
          <EditableProTable<InSourceType>
            rowKey="id"
            toolBarRender={false}
            columns={columns}
            value={data.body}
            recordCreatorProps={false}
            summary={(pageData) => summary(pageData, "入库")}
          />
        </ProForm.Item>
      </ProForm>
    </div>
    : <></>
}

export default BillReadOnly
