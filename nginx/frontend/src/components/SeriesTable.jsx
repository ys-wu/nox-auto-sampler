import React , { useState } from 'react';
import { Row, Col } from 'antd';
import SampleLine from './SampleLine'


export default function SeriesTable({ setting }) {

  const [state, setState] = useState();

  const fakeSetting = {
    type: ['校准', '质控',]
  };

  const data = [
    {
      type: '校准',
      name: '基准1',
    },
    {
      type: '质控',
      name: '质控1',
    },
  ];

  const onUpdate = (index, value) => {
    console.log('SeriesTable', index);
    console.log('SeriesTable', value);
    const newState = null;
  };

  return (
    <>
      <Row>
        <Col span={20}>
          <Row>
            <Col span={12}>类型</Col>
            <Col span={12}>样品名称</Col>
          </Row>
        </Col>
      </Row>
      { data.map((item, index) => <SampleLine key={ index } index={ index } setting={ fakeSetting } data={ item } onUpdate={ onUpdate } /> )}
    </>
  );
};
