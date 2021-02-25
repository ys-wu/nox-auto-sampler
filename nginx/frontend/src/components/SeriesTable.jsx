import React , { useState } from 'react';
import { Row, Col, Button, Select } from 'antd';
import SampleLine from './SampleLine'

const { Option } = Select;

export default function SeriesTable({ setting }) {

  const [state, setState] = useState([]);
  const [data, setData] = useState([])
  const [copiedData, setCopiedData] = useState();
  const [nextIndex, setNextIndex] = useState(1);
  const [pasteIndex, setPasteIndex] = useState();

  const blankLine = {
    type: null,
    name: null,
  };

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
    const newBlankLine = {...blankLine};
    newBlankLine['id'] = nextIndex;
    setNextIndex(nextIndex + 1);
    return newBlankLine;
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
    console.log('SeriesTable after a new line, new data:', newData);
  };

  const handleDeleteLine = index => {
    // console.log('SeriesTable delete line:', index);
    const newData = [...data];
    const newState = [...state];
    newData.splice(index, 1);
    newState.splice(index, 1);
    setData(newData);
    setState(newState);
    console.log('SeriesTable after deltele a line, new data:', newData);
    console.log('SeriesTable after deltele a line, new state:', newState);
  };

  const handleCopyLine = index => {
    console.log('SeriesTable copy line:', index);
    setCopiedData(state[index]);
  };

  const handlePasteNewLine = () => {
    console.log();
  };

  const handlePasteIndex = value => {
    console.log('SeriesTable selete paste index:', value);
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
            data.map((item, index) => <SampleLine 
              key={ item['id'] }
              index={ index }
              setting={ fakeSetting }
              data={ item }
              onUpdate={ onUpdate }
              onDeleteLine={ handleDeleteLine }
              onCopyLine={ handleCopyLine }
            /> )
        }
      <Row style={{ marginTop: 10 }}>
        <Col span={10} offset={1}>
          <Button block onClick={ handleAddNewLine }> + 添加新空白行 </Button>
        </Col>
        { 
          copiedData ?
            <Col span={10} offset={1}>
              <Row>
                <Col span={10} offset={1}>
                  <Button style={{ width: 100, float: "right" }} onClick={handlePasteNewLine}> + 粘贴至 </Button>
                </Col>
                <Col span={10} offset={0}>
                  <Select style={{ width: 100, float: "left" }} placeholder='行号' defaultValue="末行" onSelect={handlePasteIndex}>
                    {[...Array(state.length).keys(), "末行"].map(item => <Option key={item} value={item}>{item}</Option>)}
                  </Select>
                </Col>
              </Row>
            </Col>
            : null
        }
      </Row>
    </>
  );
};
