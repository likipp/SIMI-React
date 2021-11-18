import React, { useEffect, useState } from 'react';
import { Tree } from 'antd';
import { getBrandTree } from '@/pages/Product/services';

interface DataNode {
  title: string;
  key: string;
  isLeaf?: boolean;
  children?: DataNode[];
}

// const initTreeData: DataNode[] = [
//   { title: 'Expand to load', key: '0' },
//   { title: 'Expand to load', key: '1' },
//   { title: 'Tree Node', key: '2', isLeaf: true },
// ];

const handleSelect = (selectedKeys: React.Key[], info: any) => {
  console.log('selectedKeys', selectedKeys);
  console.log('info', info);
}

const BrandTree: React.FC = () => {
  const [treeData, setTreeData] = useState<DataNode>();

  useEffect(() => {
    getBrandTree().then((res) => {
      setTreeData(res.data)
    })
  }, [])

  return  (
    <div>
      <Tree treeData={treeData} onSelect={handleSelect}/>
    </div>
  )
}

export default BrandTree
