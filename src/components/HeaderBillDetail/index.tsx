import { message, Modal, Radio } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { deleteBill } from '@/pages/InList/services';
import { history } from '@@/core/history';
import { useContext } from 'react';
import { BillContext } from '@/context/billChange';

const HeaderBillDetail =(props: any) => {
  const {number, type} = props
  const {setChange} = useContext(BillContext)
  const { confirm } = Modal;

  const showDeleteConfirm = () => {
    console.log(number, "单号number")
    confirm({
      title: '确定删除此订单吗?',
      icon: <ExclamationCircleOutlined />,
      okText: '是',
      okType: 'danger',
      cancelText: '否',
      onOk() {
        deleteBill({number}).then(() => {
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

  return (
    <Radio.Group style={{marginBottom: '20px', backgroundColor: 'red'}}>
      <Radio.Button value="back"
                    onClick={() => history.goBack()}
      >返回</Radio.Button>
      <Radio.Button value="copy" disabled={true}>复制</Radio.Button>
      <Radio.Button value="change"
                    onClick={() => {
                      setChange(() => true)
                      console.log("点击修改")
                    }}
      >修改</Radio.Button>
      <Radio.Button value="delete" onClick={showDeleteConfirm}
      >删除</Radio.Button>
    </Radio.Group>
  )
}

export default HeaderBillDetail