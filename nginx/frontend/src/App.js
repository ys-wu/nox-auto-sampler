import React, { useState } from 'react';
import 'antd/dist/antd.css';
import './index.css';
import js_logo from './img/js_logo.png'
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Divider from 'antd/lib/divider';
import TabFrame from './components/TabFrame'
import Status from './components/Status'


function App() {

  const [setting, setSetting] = useState();
  const [series, setSeries] = useState();
  
  // tidy up setting data from array to obj
  const tidySetting = data => {
    const nameMapping = {
      "类型": "type",
      "偏差": "bias",
      "气瓶压力": "bottlePres",
      "气瓶类型": "bottleType",
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
    console.log("App set series table", newData);
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
        <Col span={18} offset={3}>
          <Status/>
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
