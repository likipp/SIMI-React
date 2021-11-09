import React from 'react';
import { Button, message, Tooltip } from 'antd';
import { CopyOutlined } from '@ant-design/icons';

interface copyProps {
  realDiscount: number;
}

const CopyButton: React.FC<copyProps> = (props) => {
  const {realDiscount} = props
  const copyButton = () => {
    const copyEle = document.querySelector('.contentText') // 获取要复制的节点
    console.log(copyEle, "复制节点")
    const range = document.createRange(); // 创造range
    window.getSelection()?.removeAllRanges(); //清除页面中已有的selection
    range.selectNode(copyEle as Element); // 选中需要复制的节点
    window.getSelection()?.addRange(range); // 执行选中元素
    const copyStatus = document.execCommand("Copy"); // 执行copy操作
    // 对成功与否定进行提示
    if (copyStatus) {
      message.success('复制成功');
    } else {
      message.error('复制失败');
    }
    window.getSelection()?.removeAllRanges()
  }
  return (
    <div>
      <span>实际折扣:</span>
      <span className="contentText">{Math.round(realDiscount * 100 * 1000) / 1000}</span>
      <Tooltip title="复制">
        <Button type="text" icon={<CopyOutlined />} style={{color: '#40a9ff'}} onClick={copyButton}/>
      </Tooltip>
    </div>
  )
}

export default CopyButton
