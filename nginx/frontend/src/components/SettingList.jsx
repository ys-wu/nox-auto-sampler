import React, { useState, useEffect, useLayoutEffect } from 'react';

import './SettingList.css'

import Button from 'antd/lib/button';
import List from 'antd/lib/list';
import EditableTagGroup from './EditableTagGroup'

// import Cookies from 'universal-cookie';

import post from "../helpers/apiPost";
import get from '../helpers/apiGet';


export default function SettingList({ onUpdateSetting = f => f }) {

  const defaultSetting = [
    { 'name': '样品流量', 'tags': ['1.0']},
    { 'name': '类型', 'tags': ['校准', '质控', '样品'] },
    { 'name': 'RSD', 'tags': ['0.5 %']},
    { 'name': '偏差', 'tags': ['0.1 %', '0.5 %', '1 %'] },
    {
      'name': '气瓶类型',
      'tags': ['美托 2 升', '美托 4 升', '美托 8 升', '科金 2 升', '科金 4 升', '科金 8 升']
    },
    { 'name': '气瓶压力', 'tags': ['11.0 MPa', '10.9 MPa', '10.8 MPa', '10.7 MPa'] },
    { 'name': '检测人员', 'tags': ['倪才倩', '范洁'] },
    { 'name': '项目名称', 'tags': ['NO/N2 定值', 'NO/N2 基准对比', 'NO/N2 中间气比对', 'NO/N2 实验室间比对', 'NO/N2 期间核查']},
    { 'name': '分析方法', 'tags': ['化学发光法']},
    { 'name': '仪器名称及型号', 'tags': ['42i-HL NO-NO2-NOx 分析仪']},
    { 'name': '固定资产登记号', 'tags': ['z140913', 'TY2015000086']},
  ];

  let tempSetting = [...defaultSetting];

  const [current, setCurrent] = useState();
  const [temp, setTemp] = useState(); 

  const hostname = window.location.hostname;
  const port = window.location.port;
  const url = `http://${hostname}:${port}/api/setting/`
  const urlMfc = `http://${hostname}:${port}/api/mfc/`
  // const csrftoken = new Cookies();

  // update to temp
  const updateTemp = data => {
    setTemp(data);
    setCurrent(data);
    return data;
  };

  // if fetch fail, use default setting
  const handleGetError = err => {
    setTemp(defaultSetting);
    setCurrent(defaultSetting); 
    console.error(err);
  };

  // get setting JSON from backend
  // const getSetting = () => {
  //   const d = new Date();
  //   fetch(url)
  //     .then(res => res.json())
  //     .then(updateTemp)
  //     .then((res) => console.log(d.toISOString(), 'SettingList get setting:', res))
  //     .catch(handleGetError);
  // };

  // update view
  const onUpdate = function(name, tags) {
    tempSetting = tempSetting.map(
      item => item['name'] !== name ? item : {name : name, 'tags': tags }
     );
  };
  
  // cancel temp setting
  const cancelTemp = () => {
    setTemp([...current]);
  };

  // save temp setting to current
  const saveCurrent = () => {
    if (tempSetting[0]['tags'].length !== 1) {
      alert("样品流量只能是一项！")
    } else if (isNaN(tempSetting[0]['tags'][0]) ) {
      alert("样品流量必须是个数！");
    } else if (tempSetting[2]['tags'].length !== 1) {
      alert("RSD只能是一项！");
    } else {
      setTemp([...tempSetting]);
      setCurrent([...tempSetting]);
    };
  };

  // save default setting to current
  const getDefault = () => {
    setTemp([...defaultSetting]);
  };

  // get setting from backend
  useEffect(() => {
    get(url, updateTemp, handleGetError);
  }, []);

  // update setting to state of App component, post current setting to backend
  useLayoutEffect(() => {
    if (current) {
      onUpdateSetting(current);
      post(current, url);
      post(current[0], urlMfc);
    };
  }, [current]);

  return (
    <>
      <Button onClick={ cancelTemp }>撤销</Button>
      <Button onClick={ saveCurrent }>保存</Button>
      <Button style={{ float: 'right' }} onClick={ getDefault }>获取出厂设置</Button>
      <List
        itemLayout="horizontal"
        dataSource={ temp }
        renderItem={ item => (
          <List.Item>
            <List.Item.Meta
              title={ item.name }
              description=<EditableTagGroup
                name={ item.name } 
                tags={ item.tags }  
                onUpdate = { onUpdate }
              />
            />
          </List.Item>
        )}
      />
    </>
  );
};
