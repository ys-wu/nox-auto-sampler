import React , { useState } from 'react';
import { Row, Col, Button, Select } from 'antd';
import SampleLine from './SampleLine'

const { Option } = Select;

export default function SeriesTable({ setting }) {

  const [data, setData] = useState([]);
  const [state, setState] = useState([]);
  const [copiedData, setCopiedData] = useState();
  const [nextIndex, setNextIndex] = useState(1);
  const [addIndex, setAddIndex] = useState(-1);
  const [pasteIndex, setPasteIndex] = useState(-1);

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

  const onUpdate = (value) => {
    // console.log('SeriesTable onUpdate', value);
    const oldState = [...state];
    // console.log('SeriesTable old state:', oldState);
    const newState = oldState.map(item => item['id'] === value['id'] ? value : item);
    setState(newState);
    console.log('SeriesTable updated new state:', newState);
  };

  const handleAddIndex = value => {
    const index = value === "末行" ? -1 : value - 1;
    setAddIndex(index);
    console.log('SeriesTable selete add index:', index); 
  };

  const handleAddNewLine = e => {
    const newLine = blankDataFatory();
    newLine['id'] = nextIndex;
    setNextIndex(nextIndex + 1)
    console.log('SeriesTable paste new line data:', `${nextIndex + 1}`, newLine);
    const index = addIndex === -1 ? data.length : addIndex;
    const newData = [...data];
    newData.splice(index, 0, newLine);
    setData(newData);
    const newState = [...state];
    newState.splice(index, 0, newLine);
    setState(newState);
  };

  const handleCopyLine = index => {
    console.log('SeriesTable copy line:', index);
    setCopiedData(state[index]);
  };

  const handlePasteIndex = value => {
    const index = value === "末行" ? -1 : value - 1;
    setPasteIndex(index);
    console.log('SeriesTable selete paste index:', index);
  };

  const handlePasteNewLine = () => {
    const newLine = {...copiedData};
    newLine['id'] = nextIndex;
    setNextIndex(nextIndex + 1);
    console.log('SeriesTable paste new line data:', `${pasteIndex + 1}`, newLine);
    const index = pasteIndex === -1 ? data.length : pasteIndex;
    const newData = [...data];
    newData.splice(index, 0, newLine);
    setData(newData);
    const newState = [...state];
    newState.splice(index, 0, newLine);
    setState(newState);
  };

  const handleDeleteLine = index => {
    const newData = [...data];
    const newState = [...state];
    newData.splice(index, 1);
    newState.splice(index, 1);
    setData(newData);
    setState(newState);
    console.log('SeriesTable after deltele a line, new data:', newData);
    console.log('SeriesTable after deltele a line, new state:', newState);
  };

  return (
    <>
      { state.length === 0 ? null :
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
      }

      {
        !data ? null : 
          data.map((item, index) => <SampleLine 
            key={ item['id'] }
            index={ index }
            setting={ fakeSetting }
            data={ {...item} }
            onUpdate={ onUpdate }
            onDeleteLine={ handleDeleteLine }
            onCopyLine={ handleCopyLine }
          /> )
      }

      <Row style={{ marginTop: 10 }}>
        <Col span={10} offset={1}>
          <Row>
            <Col span={10} offset={1}>
              <Button
                style={ data.length === 0 ? { height: 40, fontSize: "1.2em", backgroundColor: "ghostwhite" } : { width: 100, float: "right" }}
                onClick={handleAddNewLine}> {data.length === 0 ? "+ 新序列列表" : "+ 空白行至"}
              </Button>
            </Col>

            <Col span={10} offset={0}>
              { data.length === 0 ?
                null :
                <Select style={{ width: 75, float: "left" }} placeholder='行号' defaultValue="末行" onSelect={handleAddIndex}>
                  {[...[...Array(data.length + 1).keys()].slice(1), "末行"].map(item => <Option key={item} value={item}>{item}</Option>)}
                </Select>
              }
            </Col>
          </Row>
        </Col>

        { 
          copiedData ?
            <Col span={10} offset={1}>
              <Row>
                <Col span={10} offset={1}>
                  <Button style={{ width: 100, float: "right" }} onClick={handlePasteNewLine}> + 粘贴至 </Button>
                </Col>
                
                <Col span={10} offset={0}>
                  <Select style={{ width: 75, float: "left" }} placeholder='行号' defaultValue="末行" onSelect={handlePasteIndex}>
                    {[...[...Array(data.length + 1).keys()].slice(1), "末行"].map(item => <Option key={item} value={item}>{item}</Option>)}
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
