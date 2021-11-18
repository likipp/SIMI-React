import React, { useEffect, useState } from 'react';
import { Tree } from 'antd';
import { getBrandTree } from '@/pages/Product/services';

interface DataNode {
  title: string;
  key: string;
  isLeaf?: boolean;
  children?: DataNode[];
}

interface TreeProps {
  reload?: any;
  set: React.Dispatch<React.SetStateAction<number>>;
  brand?: number
}

const BrandTree: React.FC<TreeProps> = (prop) => {
  const {set} = prop
  const [treeData, setTreeData] = useState<DataNode[]>();

  useEffect(() => {
    getBrandTree().then((res) => {
      const tree: DataNode[] = [{title: "品牌", key: "all", children: res.data}]
      setTreeData(tree)
    })
  }, [])

  const handleSelect = (selectedKeys: React.Key[]) => {
    let brand: number = 0
    if (selectedKeys[0] != "all") {
      brand = selectedKeys[0] as number
    }
    set(brand)
  }

  return  (
    <div>
      <Tree treeData={treeData} onSelect={handleSelect}
            defaultExpandAll={true}
            autoExpandParent={true}
            defaultExpandedKeys={["all"]}
            style={{height:"661px", width: '200px', borderRight: '2px solid #eee'}}/>
    </div>
  )
}

export default BrandTree
