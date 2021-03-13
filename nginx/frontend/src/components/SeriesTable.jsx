import React , { useState, useEffect } from 'react';

import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Input from 'antd/lib/input';
import Select from 'antd/lib/select';
import Button from 'antd/lib/button';
import Popconfirm from 'antd/lib/popconfirm';
import Form from 'antd/lib/form'

import SampleLine from './SampleLine';

import get from '../helpers/apiGet';
import post from '../helpers/apiPost';

const { Option } = Select;


export default function SeriesTable({
  setting,
  analyzing,
  onSaveSeries = f => f,
  passSeriesName = f => f,
}) {

  const [form] = Form.useForm()

  const hostname = window.location.hostname;
  const urlSeries = `http://${hostname}/api/seriestemplate/`;
  const urlSample = `http://${hostname}/api/sampletemplate/`;

  const [name, setName] = useState('');
  const [loadName, setLoadName] = useState('');
  const [nameList, setNameList] = useState([]);
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
    sampleId: null,
    noInputConc: null,
    noxInputConc: null,
    bias: null,
    bottleType: null,
    bottlePres: null,
    operator: null,
    remark: null,
  };

  // get all templates
  useEffect(() => {
    get(urlSeries, updateNameList);
  }, []);

  // remove copy button if there is no data
  useEffect(() => {
    if (data.length === 0) {
      setCopiedData(null);
    }
  }, [data]);

  const updateNameList = data => {
    const list = data['results'].map(item => item["name"])
    setNameList(list);
    return list;
  };

  const onChangeName = e => {
    const value = e.target.value;
    setName(value);
  };

  const blankDataFatory = () => {
    const newBlankLine = {...blankLine};
    newBlankLine['id'] = nextIndex;
    setNextIndex(nextIndex + 1);
    return newBlankLine;
  };

  const onUpdate = (value) => {
    console.log('SeriesTable onUpdate', value);
    const oldState = [...state];
    console.log('SeriesTable old state:', oldState);
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
    setCopiedData({...state[index]});
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
    if (analyzing) {
      alert("正在分析，无法确认列表");
    } else if (name !== '') {
      passSeriesName(name);
      onSaveSeries(state);
    } else {
      alert("名称不能为空");
    };
  };

  const handleSaveTemplate = () => {
    if (nameList.includes(name)) {
      alert("同名模版也存在，继续确认将覆盖旧模版！");
    };
  };

  const createTemplate = () => {
    post({ name: name }, urlSeries);
    state.forEach((item, index) => {
      let newSampleList = {...item};
      newSampleList['series'] = name;
      newSampleList['index'] = index;
      newSampleList['sampleType'] = item['type'];
      post(newSampleList, urlSample);
    });
  };

  const updateTemplate = () => {
    deleteTemplate();
    state.forEach((item, index) => {
      let newSampleList = { ...item };
      newSampleList['series'] = name;
      newSampleList['index'] = index;
      newSampleList['sampleType'] = item['type'];
      post(newSampleList, urlSample);
    });
  };

  const apiDelete = url => {
    const d = new Date();
    fetch(url, {method: 'DELETE'})
      .then(() => console.log(d.toISOString(), 'Delete data API:', url))
      .catch(console.error);
  };

  const handleDeleteSample = data => {
    const filteredSamples = data['results'].filter(item => item['series'] === name);
    const urls = filteredSamples.map(item => `${urlSample}${item['id']}/`)
    urls.forEach(item => { apiDelete(item) });
    return data;
  };

  const deleteTemplate = () => {
    get(urlSample, handleDeleteSample);
  };

  const onConfirm = () => {
    if (name !== '') {
      const d = new Date();
      if (nameList.includes(name)) {
        updateTemplate();
        console.log(d.toISOString(), "SereisTable update post:", state);
      } else {
        createTemplate();
        console.log(d.toISOString(), "SereisTable create post:", state);
      };
    } else {
      alert("名称不能为空");
    };
    get(urlSeries, updateNameList);
  };

  const onCancel = () => {
    get(urlSeries, updateNameList);
  };
  
  const handleSelectToLoad = value => {
    const d = new Date();
    setLoadName(value);
    console.log(d.toISOString(), "SereisTable select to load:", value);
  };

  const filterSeries = data => {
    const filterData = data['results'].filter(item => item['series'] === loadName);
    const cleanedData = filterData.map(item => {
      const newItem = {...item};
      newItem['type'] = item['sampleType']
      return newItem;
    });
    const orderedData = cleanedData.reverse();
    setData(orderedData);
    setState(orderedData);
    return data;
  };

  const handleLoadSeletedSeries = () => {
    setName('');
    setData([]);
    setState([]);
    get(urlSample, filterSeries);
  };

  return (
    <>
      { state.length === 0 ? null :
        <Row style={{ paddingBottom: 10 }}>
          <Col span={10} offset={1} style={{ textAlign: "center" }}>
            <Input
              placeholder={name? name: "序列列表名称"}
              onChange={onChangeName}
            />
          </Col>
        </Row>
      }

      { state.length === 0 ? null :
        <Row style={{ paddingBottom: 2 }}>
          <Col span={20}>
            {
              !data ? null :
                <Row>
                  <Col style={{ textAlign: "center" }} span={1} offset={1}>行</Col>
                  <Col style={{ textAlign: "center" }} span={2}>类型</Col>
                  <Col style={{ textAlign: "center" }} span={2}>样品名称</Col>
                  <Col style={{ textAlign: "center" }} span={2}>样品位置</Col>
                  <Col style={{ textAlign: "center" }} span={2}>样品标号</Col>
                  <Col style={{ textAlign: "center" }} span={2}>NO 浓度</Col>
                  <Col style={{ textAlign: "center" }} span={2}>NOx 浓度</Col>
                  <Col style={{ textAlign: "center" }} span={2}>偏差</Col>
                  <Col style={{ textAlign: "center" }} span={2}>气瓶类型</Col>
                  <Col style={{ textAlign: "center" }} span={2}>气瓶压力</Col>
                  <Col style={{ textAlign: "center" }} span={2}>检测人员</Col>
                  <Col style={{ textAlign: "center" }} span={2}>备注</Col>
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
          {data.length !== 0 || nameList.length === 0 ? null :
            <Form form={form} layout="inline" onFinish={handleLoadSeletedSeries}>
              <Form.Item name="log" label="选择导入列表">
                <Select 
                  style={{ width: 175, float: "left" }} 
                  placeholder='存档序列列表'
                  onSelect={handleSelectToLoad}>
                  {nameList.map(item => <Option key={item} value={item}>{item}</Option>)}
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  开始导入
                </Button>
              </Form.Item>
            </Form>
          }
        </Col>
      </Row>

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
          <>
            <Button
              style={{ height: 40, fontSize: "1.2em", color: "DarkBlue", width: 150, float: "right" }}
              onClick={handleSaveTable}> 确认序列列表
            </Button>
            <Popconfirm title="确认提交?" onConfirm={onConfirm} onCancel={onCancel}>
              <Button
                style={{ height: 40, fontSize: "1.2em", color: "DarkBlue", width: 150, float: "right" }}
                onClick={handleSaveTemplate}> 保存为模版
            </Button>
            </Popconfirm>
          </>
      }
    </>
  );
};
