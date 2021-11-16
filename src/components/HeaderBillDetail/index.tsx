import { message, Modal, Radio } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { deleteBill } from '@/pages/InList/services';
import { history } from '@@/core/history';

const headerBillDetail =(props: any) => {
  const {number, type} = props
  const { confirm } = Modal;

  const showDeleteConfirm = () => {
    confirm({
      title: '确定删除此订单吗?',
      icon: <ExclamationCircleOutlined />,
      okText: '是',
      okType: 'danger',
      cancelText: '否',
      onOk() {
        deleteBill(number).then(() => {
          message.success("删除成功")
          history.push(`/stock-table/${type}`)
        }).catch(err => {
          console.log(err, "错误消息")
        })

      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  return <Radio.Group style={{marginBottom: '20px', backgroundColor: 'red'}}>
    <Radio.Button value="back" type={'primary'}
                  onClick={() => history.goBack()}
    >返回</Radio.Button>
    <Radio.Button value="copy" disabled={true} type={'primary'}>复制</Radio.Button>
    <Radio.Button value="change" disabled={true} type={'primary'}>修改</Radio.Button>
    <Radio.Button value="delete" type={'primary'} onClick={showDeleteConfirm}
    >删除</Radio.Button>
  </Radio.Group>
}

export default headerBillDetail
