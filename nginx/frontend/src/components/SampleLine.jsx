import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Row, Col, Select, Input, Button } from 'antd';

const { Option } = Select;

export default function SampleLine({
  index,
  setting,
  data,
  onUpdate=f=>f,
  onDeleteLine=f=>f,
  onCopyLine=f=>f
}) {

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

  const handleDelete = () => {
    // console.log('SampleLine handleDelte:', index);
    onDeleteLine(index);
  };

  const handleCopy = () => {
    console.log('SampleLine handleDelte:', index);
    onCopyLine(index);
  };

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
      <Row style={{ marginTop: 1 }}>
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
            <Col span={12}>
              <Button block onClick={ handleCopy }>复制</Button>
            </Col>
            <Col span={12}>
              <Button block onClick={ handleDelete }>删除</Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

