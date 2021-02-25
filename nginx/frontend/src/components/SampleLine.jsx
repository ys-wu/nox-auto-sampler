import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Row, Col, Select, Input } from 'antd';

const { Option } = Select;

export default function SampleLine({ index, setting, data, onUpdate=f=>f }) {

  const [state, setState] = useState();

  const typeSetting = setting['type'];

  const { id, type, name } = data;

  useEffect(() => {
    const newState = {
      id: id,
      type: type,
      name: name,
    };
    setState(newState);
    // console.log('SampleLine state:', newState);
  }, []);

  useLayoutEffect(() => {
    if ( state !== undefined ) {
      onUpdate(index, state);
    };
  }, [state]);

  const onSelectType = value => {
    // console.log('SampleLine onSelectType:', index, value);
    const newState = {...state};
    newState['type'] = value;
    setState(newState);
  };

  const onChangeName = e => {
    const value = e.target.value;
    // console.log('SampleLine onChangeName:', index, value); 
    const newState = { ...state };
    newState['name'] = value;
    setState(newState);
  };
  
  return (
    <>
      <Row>
        <Col span={20}>
          <Row>
            <Col span={12}>
              <Select placeholder='选择类型' defaultValue={ type } onSelect={ onSelectType }>
                { typeSetting.map( (item, index) => <Option key={ index } value={ item }>{ item }</Option> ) }
              </Select>
            </Col>
            <Col span={12}>
              <Input placeholder="样品名称" defaultValue={ name } onChange={ onChangeName }/>  
            </Col>
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

