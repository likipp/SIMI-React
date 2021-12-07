import React, { Suspense, useEffect, useState } from 'react';
import DebtsPie from '@/pages/Charts/pie';
import { GridContent } from '@ant-design/pro-layout';
import { Card, Col, Row } from 'antd';
import DemoColumn from '@/pages/Charts/column';
import { getProductSale } from '@/pages/Charts/services';
import styles from '@/pages/Charts/styles.less';
import type { productSale } from '@/pages/Charts/data';
import IntroduceRow from '@/pages/Charts/IntroduceRow';

export default (): React.ReactNode => {
  const [productSale, setProductSale] = useState<productSale[]>()
  useEffect(() => {
    getProductSale().then((res) => {
      console.log(res.data, "data")
      setProductSale(res.data)
    })
  }, [])

  return (
    <GridContent >
      <Suspense fallback={null}>
        <IntroduceRow />
      </Suspense>
      <Suspense fallback={null} />
      <Row
        gutter={24}
        style={{
          marginTop: 24,
        }}
      >
        <Col xl={12} lg={24} md={24} sm={24} xs={24}>
          <Suspense fallback={null}>
            <DebtsPie />
          </Suspense>
        </Col>
        <Col xl={12} lg={24} md={24} sm={24} xs={24} />
      </Row>
      <Row
        gutter={24}
        style={{
          marginTop: 24,
        }}
      >
        <Col xl={12} lg={12} md={12} sm={24} xs={24}>
          <Suspense fallback={null}>
            <DemoColumn />
          </Suspense>
        </Col>
        <Col xl={12} lg={12} md={12} sm={24} xs={24}>
          <Suspense fallback={null}>
            <Card>
              <div className={styles.salesRank}>
                <h4 className={styles.rankingTitle}>产品销售额排名</h4>
                {
                  productSale ? <ul className={styles.rankingList}>
                      {productSale.map((item, i) => (
                        <li key={item.product}>
                      <span className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}>
                        {i + 1}
                      </span>
                          <span title={item.product} className={styles.rankingItemTitle}>
                        {item.product}
                      </span>
                          <span className={styles.rankingItemValue}>
                        {item.value}
                      </span>
                        </li>
                      ))}
                    </ul>
                    : <></>
                }
              </div>
            </Card>
          </Suspense>
        </Col>
      </Row>
    </GridContent>
  );
};
