import React, { useEffect, useState } from 'react';
import { Pie, measureTextWidth } from '@ant-design/charts';
import { getPayPie } from '@/pages/Charts/services';
import type { pieData } from '@/pages/Charts/data';
import { Card } from 'antd';

// interface pieProps {
//   pieData: any
// }

const DebtsPie: React.FC = () => {
  const [data, setData] = useState<pieData[]>([{type: '', value: 0}])

  useEffect(() => {
    getPayPie().then((res) => {
      setData(() => {
        return res.data
      })
    })
  }, [])
  // const {pieData} = props
  function renderStatistic(containerWidth: any, text: any, style: any) {
    const _measureTextWidth = (measureTextWidth)(text, style),
      textWidth = _measureTextWidth.width,
      textHeight = _measureTextWidth.height;
    const R = containerWidth / 2;
    let scale = 1;
    if (containerWidth < textWidth) {
      scale = Math.min(
        Math.sqrt(
          Math.abs(Math.pow(R, 2) / (Math.pow(textWidth / 2, 2) + Math.pow(textHeight, 2))),
        ),
        1,
      );
    }
    const textStyleStr = 'width:'.concat(containerWidth, 'px;');
    return '<div style="'
      .concat(textStyleStr, ';font-size:')
      .concat(String(scale), 'em;line-height:')
      .concat(scale < 1 ? '1' : 'inherit', ';">')
      .concat(text, '</div>');
  }
  // var data = [
  //   {
  //     type: '分类一',
  //     value: 27,
  //   },
  //   {
  //     type: '分类二',
  //     value: 25,
  //   },
  //   {
  //     type: '分类三',
  //     value: 18,
  //   },
  //   {
  //     type: '分类四',
  //     value: 15,
  //   },
  //   {
  //     type: '分类五',
  //     value: 10,
  //   },
  //   {
  //     type: '其他',
  //     value: 5,
  //   },
  // ];


  const config = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    innerRadius: 0.64,
    meta: {
      value: {
        formatter: function formatter(v: string) {
          return ''.concat(v, ' \xA5');
        },
      },
    },
    label: {
      type: 'inner',
      offset: '-50%',
      style: { textAlign: 'center' },
      autoRotate: false,
      content: '{value}',
    },
    statistic: {
      title: {
        offsetY: -4,
        customHtml: function customHtml(container: any, view: any, datum: any) {
          const _container$getBoundin = container.getBoundingClientRect(),
            width = _container$getBoundin.width,
            height = _container$getBoundin.height;
          const d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
          const text = datum ? datum.type : '总计';
          return renderStatistic(d, text, { fontSize: 28 });
        },
      },
      content: {
        offsetY: 4,
        style: { fontSize: '32px' },
        customHtml: function customHtml(container: any, view: any, datum: any, datas: any) {
          const _container$getBoundin2 = container.getBoundingClientRect(),
            width = _container$getBoundin2.width;
          const text = datum
            ? '\xA5 '.concat(datum.value)
            : '\xA5 '.concat(
              datas.reduce(function(r: any, d: any) {
                return r + d.value;
              }, 0),
            );
          return renderStatistic(width, text, { fontSize: 32 });
        },
      },
    },
    interactions: [
      { type: 'element-selected' },
      { type: 'element-active' },
      { type: 'pie-statistic-active' },
    ],
  };
  return (
    <Card>
      <Pie {...config} />
    </Card>
  );
};

export default DebtsPie;
