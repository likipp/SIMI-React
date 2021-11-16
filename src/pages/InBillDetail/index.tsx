import { Radio, Modal, message } from 'antd';
import { history, useParams } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import ProForm, {
  ProFormDatePicker,
  ProFormText,
} from '@ant-design/pro-form';
import { useState } from 'react';
import moment from 'moment';
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import { getInBillDetail } from '@/pages/InBillDetail/services';
import summary from '@/utils/summary';
import type { InSourceType } from '@/pages/ExBillDetail/data';
import { requestWareHouse } from '@/components/BaseBill/services';
import { deleteBill } from '@/pages/InList/services';
import { ExclamationCircleOutlined } from '@ant-design/icons';

// const defaultData: InSourceType[] = [];

const columns: ProColumns<InSourceType>[] = [
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
    request: requestWareHouse,
  },
  {
    title: '数量',
    align: 'right',
    dataIndex: 'in_qty',
    valueType: 'digit',
  },
  {
    title: '产品代码',
    align: 'right',
    dataIndex: 'p_number2',
    hideInTable: true,
  },
  {
    title: '金额',
    align: 'right',
    dataIndex: 'total',
    valueType: 'money',
  },
];

export default () => {
  const number = useParams();
  const [data, setDate] = useState([]);
  // const [modal, setModal] = useState(false)
console.log(data, "data", number, "单号")

  const { confirm } = Modal;

  const showDeleteConfirm = () => {
    confirm({
      title: '确定删除此订单吗?',
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      okText: '是',
      okType: 'danger',
      cancelText: '否',
      onOk() {
        deleteBill(number).then(() => {
          message.success("删除成功")
          history.push("/stock-table/in")
        }).catch(err => {
          console.log(err, "错误消息")
        })

      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }


  return (
    <PageContainer
      header={{
        title: '入库单详情',
      }}
    >
      {
        data == [] ? <></>
          : <Radio.Group style={{marginBottom: '20px', backgroundColor: 'red'}}>
            <Radio.Button value="back" type={'primary'}
                          onClick={() => history.goBack()}
            >返回</Radio.Button>
            <Radio.Button value="copy" disabled={true} type={'primary'}>复制</Radio.Button>
            <Radio.Button value="change" disabled={true} type={'primary'}>修改</Radio.Button>
            <Radio.Button value="delete" type={'primary'} onClick={showDeleteConfirm}
                          // onClick={() => {
                          //   deleteBill(number).then(() => {
                          //     console.log("删除成功")
                          //   }).catch(err => {
                          //     console.log(err, "错误消息")
                          //   })
                          //   history.push("/manager/in")
                          // }}
            >删除</Radio.Button>
          </Radio.Group>
      }
      <ProForm<InSourceType>
        submitter={{
          render: () => {
            return [];
          },
        }}
        request={async () => {
          return Promise.resolve(
            getInBillDetail(number)
              .then((res) => {
                console.log("set, 查看set次数")
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
          <ProFormText width="sm" name="bill_number" label="单据编号" disabled={true} />
          <ProFormDatePicker
            name="created_at"
            label="单据日期"
            initialValue={moment(new Date().getTime()).format('YYYY-MM-DD')}
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
