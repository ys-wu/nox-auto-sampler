import React from 'react';
import { Row, Col } from 'antd';
import SerieLine from './SerieLine'


export default function SeriesTable() {

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

  return (
    <>
      <Row>
        <Col span={20}>
          <Row>
            <Col span={12}>col-12</Col>
            <Col span={12}>col-12</Col>
          </Row>
        </Col>
      </Row>
      { data.map( (item, index) => <SerieLine key={ index } data={ item }/> )}
    </>
  );
};
