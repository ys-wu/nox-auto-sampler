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
  const biasSetting = setting['bias'];

  const { id, type, name, position,    bias } = data;

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
      onUpdate(state);
    };
  }, [state]);

  const handleDelete = () => {
    // console.log('SampleLine handleDelte:', index);
    onDeleteLine(index);
  };

  const handleCopy = () => {
    // console.log('SampleLine handleCopy:', index);
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
 
  const onChangePosition = e => {
    const value = e.target.value;
    const newState = { ...state };
    newState['position'] = value;
    setState(newState);
  }; 
  




  const onSelectBias = value => {
    const newState = { ...state };
    newState['bias'] = value;
    setState(newState);
  };

  return (
    <>
      <Row style={{ marginTop: 1 }}>
        <Col span={20}>
          <Row>
            <Col span={2}>
              <Select placeholder='类型' defaultValue={ type } onSelect={ onSelectType }>
                { typeSetting.map( (item, index) => <Option key={ index } value={ item }>{ item }</Option> ) }
              </Select>
            </Col>

            <Col span={2}>
              <Input placeholder="样品名称" defaultValue={ name } onChange={ onChangeName }/>  
            </Col>

            <Col span={2}>
              <Input placeholder="样品位置" defaultValue={ position } onChange={ onChangePosition } />
            </Col>
            



            <Col span={2}>
              <Select placeholder='偏差' defaultValue={bias} onSelect={onSelectBias}>
                {biasSetting.map((item, index) => <Option key={index} value={item}>{item}</Option>)}
              </Select>
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

