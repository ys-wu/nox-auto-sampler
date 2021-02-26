import React, { useState, useEffect } from 'react';

import 'antd/dist/antd.css';
import './index.css';
import js_logo from './img/js_logo.png'

import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Divider from 'antd/lib/divider';

import MockPanel from './components/MockPanel'
import Status from './components/Status'
import TabFrame from './components/TabFrame'

import useInterval from './hooks/useInterval'

function App() {

  const [mock, setMock] = useState('off');
  const [start, setStart] = useState(false);
  const [setting, setSetting] = useState();
  const [series, setSeries] = useState();
  const [data, setData] = useState(null);

  // interval of fetching data in (ms)
  const delay = 2000;

  const hostname = window.location.hostname;
  const dataUrl = `http://${hostname}/data/`

  const postData = (data) => {
    const d = new Date();
    console.log(d.toISOString(), 'App post data:', data);
    fetch(dataUrl, {
        method: "POST",
        headers: {
          'Accept': 'application/json, text/plain',
          'Content-Type': 'application/json; charset=UTF-8',
          // 'X-CSRFToken': csrftoken
        },
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then((res) => console.log(d.toISOString(), 'App post data response:', res))
      .catch(console.error);
    };

  const getData = () => {
    const d = new Date();
    fetch(dataUrl)
      .then(res => res.json())
      .then(saveData)
      .then((res) => console.log(d, 'App get data:', res))
      .catch(console.error);
  };

  // save data to state
  const saveData = data => {
    const newData = 'Message' in data ? null : {...data};
    setData(newData);
    return newData;
  };

  // defaul status idle
  useEffect( () => {
    postData({'status': 'idle'});
  }, []);

  // set data to null when stop sampling
  useEffect(() => {
    if (!start) {
      setData(null);
    };
  }, [start]);

  // fetch data with given interval
  useInterval( () => {
    getData();
  }, start ? delay : null);

  const switchSampling = (value) => {
    setStart(value);
  };

  const triggerMock = () => {
    setMock('on');
  };

  // tidy up setting data from array to obj
  const tidySetting = data => {
    const nameMapping = {
      "类型": "type",
      "偏差": "bias",
      "气瓶类型": "bottleType",
      "气瓶压力": "bottlePres",
      "检测人员": "operator"
    };
    const obj ={};
    data.forEach(element => {
      obj[nameMapping[element['name']]] = element['tags'];
    });
    return obj;
  };

  // update setting state, data from SettingList component
  const updateSetting = data => {
    const obj = tidySetting(data);
    setSetting(obj);
    console.log('App update setting:', obj);
  };

  // tidy up series data before setSeries
  const tidySeries = data => {
    const newData = [...data];
    newData.forEach( item => {delete item['id']});
    return newData;
  };

  // get series table after user comfirmed
  const handleSetSeries = (data) => {
    const newData = tidySeries(data);
    setSeries(newData);
    console.log("App get series table", newData);
  };

  return (
    <div className="App">
      <Row>
        <Col span={18} offset={3} >
          <h1 style={{ float: 'left' }}>氮氧化物自动进样系统</h1>
          <img style={{ float: 'right', marginTop: '10px'}}src={ js_logo } alt={"Logo"} width={100}/>
        </Col>
      </Row>
      <Row>
        { mock === 'off' ? null :
          <Col span={18} offset={3}>
            <MockPanel quitMock={ () => setMock('off') }/>
          </Col>
        }
      </Row>
      <Row>
        <Col span={18} offset={3}>
          <Status data={data} switchSampling={switchSampling} triggerMock={triggerMock}/ >
        </Col>
      </Row>
      <Row>
        <Col span={18} offset={3}>
          <TabFrame 
            setting={ setting }
            onUpdateSetting={ updateSetting } 
            onSaveSeries={ handleSetSeries }
          />
        </Col>
      </Row>
      <Row>
        <Col span={18} offset={3}>
          <Divider orientation="left"></Divider>
          <p style={{ textAlign: 'center', fontSize: '8px', marginTop: '30px' }}>
            © Copyright 2021. All Rights Reserved.
            <br></br>北京嘉时高科科技发展有限公司
          </p>
        </Col>
      </Row>
    </div>
  );
};

export default App;
