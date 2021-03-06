import React , { useState, useEffect } from 'react';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Select from 'antd/lib/select';
import Button from 'antd/lib/button';
import SampleLine from './SampleLine'

import get from '../helpers/apiGet';
import post from '../helpers/apiPost';

const { Option } = Select;

export default function SeriesTable({ setting, onSaveSeries = f => f }) {

  const hostname = window.location.hostname;
  const url = `http://${hostname}/api/seriestemplate/`

  const [nameList, setNameList] = useState([]);
  const [nameIndex, setNameIndex] = useState(-1);
  const [data, setData] = useState([]);
  const [state, setState] = useState([]);
  const [copiedData, setCopiedData] = useState();
  const [nextIndex, setNextIndex] = useState(1);
  const [addIndex, setAddIndex] = useState(-1);
  const [pasteIndex, setPasteIndex] = useState(-1);

  // define table columns
  const blankLine = {
    type: null,
    name: null,
    position: null,
    sampleID: null,
    noInputConc: null,
    noxInputConc: null,
    bias: null,
    bottleType: null,
    bottlePres: null,
    Operator: null,
    Remar: null,
  };

  // get all templates
  useEffect(() => {
    get(url, initNameList)
  }, []);

  // remove copy button if there is no data
  useEffect(() => {
    if (data.length === 0) {
      setCopiedData(null);
    }
  }, [data]);

  const initNameList = data => {
    const list = data['results'].map(item => item["name"])
    setNameList(list);
    return list;
  };

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
    if (addIndex > data.length) {
      setAddIndex(-1);
    };
    if (pasteIndex > data.length) {
      setPasteIndex(-1);
    };
    console.log('SeriesTable after deltele a line, new data:', newData);
    console.log('SeriesTable after deltele a line, new state:', newState);
  };

  const handleSaveTable = () => {
    onSaveSeries(state);
  };

  return (
    <>
      { state.length === 0 ? null :
        <Row>
          <Col span={20}>
            {
              !data ? null :
                <Row>
                  <Col span={1} offset={1}>行</Col>
                  <Col span={2}>类型</Col>
                  <Col span={2}>样品名称</Col>
                  <Col span={2}>样品位置</Col>
                  <Col span={2}>样品标号</Col>
                  <Col span={2}>NO 浓度</Col>
                  <Col span={2}>NOx 浓度</Col>
                  <Col span={2}>偏差</Col>
                  <Col span={2}>气瓶类型</Col>
                  <Col span={2}>气瓶压力</Col>
                  <Col span={2}>检测人员</Col>
                  <Col span={2}>备注</Col>
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
            setting={ setting }
            data={ {...item} }
            onUpdate={ onUpdate }
            onDeleteLine={ handleDeleteLine }
            onCopyLine={ handleCopyLine }
          /> )
      }

      <Row style={{ marginTop: 10 }}>
        <Col span={9} offset={1}>
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
            <Col span={9} offset={1}>
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

      {
        data.length === 0 ? null :
          <Button
            style={{ height: 40, fontSize: "1.2em", color: "DarkBlue", width: 100, float: "right" }}
            onClick={ handleSaveTable }> 保存
          </Button>
      }
    </>
  );
};
