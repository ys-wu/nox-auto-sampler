import React, { useState, useEffect } from 'react';

import 'antd/dist/antd.css';
import './index.css';
import js_logo from './img/js_logo.png'

import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Divider from 'antd/lib/divider';
import Alert from 'antd/lib/alert';

import MockPanel from './components/MockPanel'
import Status from './components/Status'
import TabFrame from './components/TabFrame'

import useInterval from './hooks/useInterval'

function App() {

  const [mock, setMock] = useState(false);
  const [start, setStart] = useState(false);
  const [setting, setSetting] = useState();
  const [series, setSeries] = useState();
  const [data, setData] = useState(null);
  const [power, setPower] = useState(1);

  // interval of fetching data in (ms)
  const delay = 2000;

  const hostname = window.location.hostname;
  const url = `http://${hostname}/data/`

  // clean up before unload page
  window.onbeforeunload = e => {
    e.preventDefault();
    return e.returnValue = '确认退出程序吗？';
  };
  window.onunload = () => {
    navigator.sendBeacon(url, JSON.stringify({status: 'idle'}));
  };

  // default status is idle
  useEffect(() =>{
    postData({status: 'idle'});
  }, []);

  // show warning for power failure
  useEffect(() => {
    if (data !== null) {
      if (data['power'] === 0) {
        setPower(0);
      } else {
        setPower(1);
      };
    };
  }, [data]);

  // set data to null when stop sampling
  useEffect(() => {
    if (!start) {
      setData(null);
      postData({status: 'idle'});
    };
  }, [start]);

  const postData = (data) => {
    const d = new Date();
    console.log(d.toISOString(), 'App post data:', data);
    fetch(url, {
        method: "POST",
        headers: {
          'Accept': 'application/json, text/plain',
          'Content-Type': 'application/json; charset=UTF-8',
          // 'X-CSRFToken': csrftoken
        },
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then((res) => console.log(d.toISOString(), 'App post response data:', res))
      .catch(console.error);
    };

  const getData = () => {
    const d = new Date();
    fetch(url)
      .then(res => res.json())
      .then(saveData)
      .then((res) => console.log(d.toISOString(), 'App get data:', res))
      .catch(console.error);
  };

  // save data to state
  const saveData = data => {
    const newData = 'Message' in data ? null : {...data};
    setData(newData);
    return newData;
  };

  // fetch data with given interval
  useInterval( () => {
    getData();
  }, start ? delay : null);

  const switchSampling = (value) => {
    setStart(value);
  };

  const triggerMock = () => {
    setMock(true);
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
    const d = new Date();
    const obj = tidySetting(data);
    setSetting(obj);
    console.log(d.toISOString(), 'App update setting:', obj);
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
      { power !== 0 ? null :
        <Alert
          message="警告"
          description="外部供电故障，已分析停止，将在 UPS 耗尽前自动关机！"
          type="warning"
          showIcon
          // closable
        />
      }
      <Row>
        <Col span={18} offset={3} >
          <h1 style={{ float: 'left' }}>氮氧化物自动进样系统</h1>
          <img style={{ float: 'right', marginTop: '10px'}}src={ js_logo } alt={"Logo"} width={100}/>
        </Col>
      </Row>
      <Row>
        { mock === false ? null :
          <Col span={18} offset={3}>
            <MockPanel quitMock={ () => setMock(false) }/>
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
