import React from 'react';
import { Row, Col } from 'antd';

export default function SerieLine({ data }) {

  return (
    <>
      <Row>
        <Col span={20}>
          <Row>
            <Col span={12}>{ data['type'] }</Col>
            <Col span={12}>{ data['name'] }</Col>
          </Row>
        </Col>
        <Col span={4}>
          <Row>
            <Col span={12}>copy</Col>
            <Col span={12}>delete</Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

