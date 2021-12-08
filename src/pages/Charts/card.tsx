import React, {useEffect, useState} from "react";
import { StatisticCard } from '@ant-design/pro-card';
import RcResizeObserver from 'rc-resize-observer';
import {getProfitCompare, getSumCost, getSumTotal} from "@/pages/Charts/services";
import {profitCompare} from "@/pages/Charts/data";
import toDecimal2 from "@/utils/toDecimal2";

const { Statistic, Divider } = StatisticCard;

const ProfitCard: React.FC = () => {
  const [data, setData] = useState<profitCompare>()
  const [cost, setCost] = useState(0)
  const [total, setTotal] = useState(0)
  const [responsive, setResponsive] = useState(false);
  useEffect(() => {
    getProfitCompare().then((res) => {
      setData(res?.data)
    })

    getSumTotal().then((res) => {
      setTotal(res?.data)
    })

    getSumCost().then((res) => {
      setCost(res?.data)
    })
  }, [])

  return (
    <RcResizeObserver
      key="resize-observer"
      onResize={(offset) => {
        setResponsive(offset.width < 596);
      }}
    >
      <StatisticCard.Group direction={responsive ? 'column' : 'row'}>
      {
        data != undefined ? <StatisticCard
          statistic={{
            title: '销售月利润',
            value: data?.this_month,
            description: (
              data?.up ? <Statistic title="月同比" value= {toDecimal2(data?.this_month - data?.pre_month)} trend={"up"} />
                : <Statistic title="月同比" value= {toDecimal2(data?.pre_month - data?.this_month)} trend={"down"} />
            ),
          }}
        />
          : <></>
      }
        <Divider type={responsive ? 'horizontal' : 'vertical'} />
        <StatisticCard
          statistic={{
            title: '销售总额',
            value: total ? `¥${total}` : 0,
          }}
        />
        <StatisticCard
          statistic={{
            title: '采购总额',
            value: cost ? `¥${cost}` : 0,
          }}
        />
      </StatisticCard.Group>
    </RcResizeObserver>
  )
}

export default ProfitCard;
