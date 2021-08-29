import React, { useState, useEffect } from 'react';

import 'antd/dist/antd.css';
import './index.css';
import js_logo from './img/js_logo.png'

import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Divider from 'antd/lib/divider';
import Alert from 'antd/lib/alert';

import MockPanel from './components/MockPanel';
import StatusPanel from './components/StatusPanel';
import TabFrame from './components/TabFrame';

import useInterval from './hooks/useInterval';

import post from './helpers/apiPost';
import get from './helpers/apiGet';


function App() {

  const [mock, setMock] = useState(false);
  const [start, setStart] = useState(false);
  const [setting, setSetting] = useState();
  const [series, setSeries] = useState();
  const [data, setData] = useState(null);
  const [power, setPower] = useState(1);
  const [analyzing, setAnalyzing] = useState(false);

  // interval of fetching data in (ms)
  const delay = 2000;

  // API config
  const hostname = window.location.hostname;
  const port = window.location.port;
  const urlData = `http://${hostname}:${port}/api/data/`;
  const urlMock = `http://${hostname}:${port}/mock/`;

  // clean up before unload page
  window.onbeforeunload = e => {
    e.preventDefault();
    return e.returnValue = '确认退出程序吗？';
  };
  window.onunload = () => {
    navigator.sendBeacon(urlData, JSON.stringify({status: 'idle'}));
  };

  // default status is idle
  useEffect(() =>{
    // post({mock: 'off'}, urlMock);
    post({status: 'idle'}, urlData);
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
      post({status: 'idle'}, urlData);
    };
  }, [start]);

  // save data to state
  const saveData = data => {
    const newData = 'Message' in data ? null : {...data};
    setData(newData);
    return newData;
  };

  // cannot get data
  const getDataError = e => {
    setData(null)
    console.error(e)
  };

  // fetch data with given interval
  useInterval( () => {
    get(urlData, saveData, getDataError);
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
      "样品流量": "flowSet",
      "类型": "type",
      "RSD": "rsd",
      "偏差": "bias",
      "气瓶类型": "bottleType",
      "气瓶压力": "bottlePres",
      "检测人员": "operator",
      "项目名称": "projectName",
      "分析方法": "method",
      "仪器名称及型号": "instrumentName",
      "固定资产登记号": "assetNumber",
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

  // get series table after user comfirmed
  const handleSetSeries = (data) => {
    setSeries(data);
    console.log("App get series table", data);
  };

  const passAnalyzing = analyzing => {
    setAnalyzing(analyzing);
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
        <Col span={20} offset={2} >
          <h1 style={{ float: 'left' }}>氮氧化物自动进样系统</h1>
          <img style={{ float: 'right', marginTop: '10px'}}src={ js_logo } alt={"Logo"} width={100}/>
        </Col>
      </Row>
      <Row>
        { mock === false ? null :
          <Col span={20} offset={2}>
            <MockPanel quitMock={ () => setMock(false) }/>
          </Col>
        }
      </Row>
      <Row>
        <Col span={20} offset={2}>
          <StatusPanel
            data={data}
            analyzing={analyzing}
            switchSampling={switchSampling}
            triggerMock={triggerMock}
          />
        </Col>
      </Row>
      <Row>
        <Col span={20} offset={2}>
          <TabFrame 
            start={ start }
            setting={ setting }
            series={series}
            data = { data }
            onUpdateSetting={ updateSetting } 
            onSaveSeries={ handleSetSeries }
            passAnalyzing={ passAnalyzing }
          />
        </Col>
      </Row>
      <Row>
        <Col span={20} offset={2}>
          <Divider orientation="left"></Divider>
          <p style={{ textAlign: 'center', fontSize: '12px', marginTop: '30px' }}>
            © Copyright 2021. All Rights Reserved.
            <br></br>北京嘉时高科科技发展有限公司
          </p>
        </Col>
      </Row>
    </div>
  );
};

export default App;
