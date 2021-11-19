import React, { useEffect, useState } from 'react';
import { Tree } from 'antd';
import { getBrandTree } from '@/pages/Product/services';
import { HomeOutlined } from '@ant-design/icons';

interface DataNode {
  title: string;
  key: string;
  isLeaf?: boolean;
  icon?: JSX.Element;
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
  const [expandedKeys, setExpandedKeys] = useState<string[]>()
  const [defaultExpandAll, setDefaultExpandAll] = useState(false)

  useEffect(() => {
    getBrandTree().then((res) => {
      const tree: DataNode[] = [{title: "品牌", key: "all", icon: <HomeOutlined style={{color:'#F5222D', marginRight: '5px'}}/>, children: res.data}]
      setTreeData(tree)
      setExpandedKeys(() => {
        return ['all']
      })
      setDefaultExpandAll(() => {
        return true
      })
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
    <div style={{width: '150px', borderRight: '2px solid #eee', backgroundColor: '#fff'}}>
      <Tree showIcon={true} treeData={treeData} onSelect={handleSelect} style={{display: 'flex', paddingTop: '16px'}}
            defaultExpandAll={defaultExpandAll}
            defaultExpandedKeys={expandedKeys} />
    </div>
  )
}

export default BrandTree
