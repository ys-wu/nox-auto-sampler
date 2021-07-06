import React, { useState, useEffect, useLayoutEffect } from 'react';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Select from 'antd/lib/select';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';

const { Option } = Select;

export default function SampleLine({
  index,
  setting,
  data,
  onUpdate=f=>f,
  onDeleteLine=f=>f,
  onCopyLine=f=>f
}) {

  const {
    type,
    name,
    position,
    sampleId,
    noInputConc,
    noxInputConc,
    bias,
    bottleType,
    bottlePres,
    operator,
    remark
  } = data;

  const [state, setState] = useState();

  const typeSetting = setting['type'];
  const biasSetting = setting['bias'];
  const bottleTypeSetting = setting['bottleType'];
  const bottlePresSetting = setting['bottlePres'];
  const operatorSetting = setting['operator'];

  useEffect(() => {
    const newState = {...data};
    setState(newState);
    // console.log('SampleLine state:', newState);
  }, []);

  useLayoutEffect(() => {
    if ( state !== undefined ) {
      onUpdate({...state});
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
  
  const onChangeSampleId = e => {
    const value = e.target.value;
    const newState = { ...state };
    newState['sampleId'] = value;
    setState(newState);
  }; 

  const onChangeNoInput = e => {
    const value = e.target.value;
    const newState = { ...state };
    newState['noInputConc'] = parseFloat(value);
    setState(newState);
  }; 

  const onChangeNoxInput = e => {
    const value = e.target.value;
    const newState = { ...state };
    newState['noxInputConc'] = parseFloat(value);
    setState(newState);
  }; 

  const onSelectBias = value => {
    const newState = { ...state };
    newState['bias'] = value;
    setState(newState);
  };

  const onSelectBottleType = value => {
    const newState = { ...state };
    newState['bottleType'] = value;
    setState(newState);
  };

  const onSelectBottlePres = value => {
    const newState = { ...state };
    newState['bottlePres'] = value;
    setState(newState);
  };

  const onSelectOperator = value => {
    const newState = { ...state };
    newState['operator'] = value;
    setState(newState);
  };

  const onChangeRemark = e => {
    const value = e.target.value;
    const newState = { ...state };
    newState['remark'] = value;
    setState(newState);
  }; 

  return (
    <>
      <Row style={{ marginTop: 1 }}>
        <Col span={20}>
          <Row>
            <Col span={1} offset={0}>
              <p>{ index + 1 }</p>
            </Col>
            <Col span={2}>
              <Select placeholder='类型' defaultValue={ type } onSelect={ onSelectType }>
                { typeSetting.map( (item, index) => <Option key={ index } value={ item }>{ item }</Option> ) }
              </Select>
            </Col>

            <Col span={2}>
              <Input placeholder="样品名称" defaultValue={ name } onChange={ onChangeName }/>  
            </Col>

            <Col span={1}>
              <Input placeholder="样品位置" defaultValue={ position } onChange={ onChangePosition } />
            </Col>
            
            <Col span={4}>
              <Input placeholder="样品编号" defaultValue={sampleId} onChange={onChangeSampleId} />
            </Col>

            <Col span={2}>
              <Input placeholder="NO 浓度" defaultValue={noInputConc} onChange={onChangeNoInput} />
            </Col>

            <Col span={2}>
              <Input placeholder="NOx 浓度" defaultValue={noxInputConc} onChange={onChangeNoxInput} />
            </Col>

            <Col span={2}>
              <Select placeholder='偏差' defaultValue={bias} onSelect={onSelectBias}>
                {biasSetting.map((item, index) => <Option key={index} value={item}>{item}</Option>)}
              </Select>
            </Col>

            <Col span={2}>
              <Select placeholder='气瓶类型' defaultValue={bottleType} onSelect={onSelectBottleType}>
                {bottleTypeSetting.map((item, index) => <Option key={index} value={item}>{item}</Option>)}
              </Select>
            </Col>

            <Col span={2}>
              <Select placeholder='气瓶压力' defaultValue={bottlePres} onSelect={onSelectBottlePres}>
                {bottlePresSetting.map((item, index) => <Option key={index} value={item}>{item}</Option>)}
              </Select>
            </Col>

            <Col span={2}>
              <Select placeholder='检测人员' defaultValue={operator} onSelect={onSelectOperator}>
                {operatorSetting.map((item, index) => <Option key={index} value={item}>{item}</Option>)}
              </Select>
            </Col>

            <Col span={2}>
              <Input placeholder="备注" defaultValue={remark} onChange={onChangeRemark} />
            </Col>
          </Row>
        </Col>

        <Col span={4}>
          <Row>
            <Col span={12}>
              <Button block style={{ color: "DarkSlateBlue" }} onClick={ handleCopy }>复制</Button>
            </Col>
            <Col span={12}>
              <Button block style={{ color: "DarkRed" }} onClick={ handleDelete }>删除</Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

