import React , { useState } from 'react';
import { Row, Col, Button } from 'antd';
import SampleLine from './SampleLine'


export default function SeriesTable({ setting }) {

  const [state, setState] = useState([]);
  const [data, setData] = useState([])

  const fakeSetting = {
    type: ['校准', '质控',]
  };

  const fakedData = [
    {
      id: 1,
      type: '校准',
      name: '基准1',
    },
    {
      id: 2,
      type: '质控',
      name: '质控1',
    },
  ];

  const blankDataFatory = () => {
    return {
      id: data.length + 1,
      type: null,
      name: null,
    };
  };

  const onUpdate = (index, value) => {
    // console.log('SeriesTable onUpdate', index, value);
    // console.log('SeriesTable old state:', state);
    const newState = [...state];
    newState[index] = value;
    setState(newState);
    console.log('SeriesTable new state:', newState);
  };

  const handleAddNewLine = e => {
    // console.log('SeriesTable click add a new line');
    // console.log('SeriesTable old data:', data);
    const newData = [...data];
    newData.push(blankDataFatory());
    setData(newData);
    console.log('SeriesTable new data:', newData);
  };

  return (
    <>
      <Row>
        <Col span={20}>
          {
            !data ? null :
              <Row>
                <Col span={12}>类型</Col>
                <Col span={12}>样品名称</Col>
              </Row>
          }
        </Col>
      </Row>
        {
          !data ? null : 
            data.map((item, index) => <SampleLine key={ item['id'] } index={ index } setting={ fakeSetting } data={ item } onUpdate={ onUpdate } /> )
        }
      <Row>
        <Col span={18} offset={1}>
          <Button block onClick={ handleAddNewLine }> + 添加一行</Button>
        </Col>
      </Row>
    </>
  );
};
