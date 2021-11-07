import { Button } from 'antd';
import { history, useParams } from 'umi';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import ProForm, {
  ProFormDatePicker,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-form';
import { useState } from 'react';
import moment from 'moment';
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import { getExBillDetail } from '@/pages/ExBillDetail/services';
import { getCustomList } from '@/pages/Product/services';
import summary from '@/utils/summary';
import type { ExSourceType } from '@/pages/ExBillDetail/data';

const defaultData: ExSourceType[] = [];

const columns: ProColumns<ExSourceType>[] = [
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
    width: '10%',
    valueType: 'select',
    fieldProps: () => {
      return {
        optionItemRender(item: { label: string; value: string }) {
          return item.label + ' - ' + item.value;
        },
        showArrow: false,
        showSearch: true,
      };
    },
  },
  {
    title: '产品名称',
    align: 'right',
    dataIndex: 'p_name',
    width: '20%',
  },
  {
    title: '单价',
    align: 'right',
    dataIndex: 'unit_price',
    valueType: 'money',
  },
  {
    title: '仓库',
    align: 'right',
    dataIndex: 'ware_house',
    valueType: 'select',
  },
  {
    title: '数量',
    align: 'right',
    dataIndex: 'ex_qty',
    valueType: 'digit',
  },
  {
    title: '产品代码',
    align: 'right',
    dataIndex: 'p_number2',
    hideInTable: true,
  },
  {
    title: '会员折扣',
    align: 'right',
    dataIndex: 'ex_discount',
    valueType: 'percent',
  },
  {
    title: '金额',
    align: 'right',
    dataIndex: 'total',
    valueType: 'money',
  },
  {
    title: '进货折扣',
    align: 'right',
    dataIndex: 'in_discount',
    valueType: 'percent',
  },
  {
    title: '成本',
    align: 'right',
    dataIndex: 'cost',
    valueType: 'money',
  },
  {
    title: '利润',
    align: 'right',
    dataIndex: 'profit',
    valueType: 'money',
  },
];

export default () => {
  const number = useParams();
  const [data, setDate] = useState([]);
  const [disabled] = useState(true);

  return (
    <PageContainer
      header={{
        title: '订单详情',
      }}
    >
      <Button
        onClick={() => history.goBack()}
        icon={<ArrowLeftOutlined />}
        style={{ marginBottom: '25px' }}
        type={'primary'}
      >
        返回
      </Button>
      <ProForm<ExSourceType>
        submitter={{
          // searchConfig: {
          //   resetText: '重置',
          //   submitText: '保存'
          // },
          render: () => {
            return [];
          },
        }}
        request={async () => {
          return Promise.resolve(
            getExBillDetail(number)
              .then((res) => {
                setDate(res.data.body);
                return res.data;
              })
              .catch((err) => {
                console.log(err);
              }),
          );
        }}
      >
        <ProForm.Group>
          <ProFormText width="sm" name="bill_number" label="单据编号" disabled={disabled} />
          <ProFormDatePicker
            name="created_at"
            label="单据日期"
            initialValue={moment(new Date().getTime()).format('YYYY-MM-DD')}
            disabled={disabled}
          />

          <ProFormRadio.Group
            name="pay_method"
            label="付款方式"
            disabled={disabled}
            options={[
              {
                label: '支付宝',
                value: 'ali',
              },
              {
                label: '微信',
                value: 'wechat',
              },
            ]}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormSelect
            name="c_number"
            label="客户代码"
            showSearch
            width={'sm'}
            disabled={disabled}
            request={async (keyWords) => {
              return Promise.resolve(getCustomList(keyWords)).then((res) => {
                return res.data;
              });
            }}
          />
          <ProFormText width="md" name="c_name" label="客户名称" disabled={disabled} />
          <ProFormText
            width="md"
            name="custom"
            label="客户名称"
            tooltip="最长为 24 位"
            placeholder="请输入名称"
            disabled={true}
            hidden={true}
          />
        </ProForm.Group>
        <ProForm.Item
          name="body"
          initialValue={defaultData}
        >
          <EditableProTable<ExSourceType>
            rowKey="id"
            toolBarRender={false}
            columns={columns}
            value={data}
            controlled
            recordCreatorProps={false}
            summary={(pageData) => summary(pageData, "出库")}
          />
        </ProForm.Item>
      </ProForm>
    </PageContainer>
  );
};

// ExBillDetail