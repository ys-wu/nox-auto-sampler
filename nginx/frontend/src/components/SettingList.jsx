import React, { useState, useEffect, useLayoutEffect } from 'react';
import './SettingList.css'
import Button from 'antd/lib/button';
import List from 'antd/lib/list';
import EditableTagGroup from './EditableTagGroup'
// import Cookies from 'universal-cookie';

export default function SettingList({ onUpdateSetting = f => f }) {

  const defaultSetting = [
    { 'name': '类型', 'tags': ['校准', '质控', '样品'] },
    { 'name': '偏差', 'tags': ['0.1 %', '0.5 %', '1 %'] },
    {
      'name': '气瓶类型',
      'tags': ['美托 2 升', '美托 4 升', '美托 8 升', '科金 2 升', '科金 4 升', '科金 8 升']
    },
    { 'name': '气瓶压力', 'tags': ['11.0 MPa', '10.9 MPa', '10.8 MPa', '10.7 MPa'] },
    { 'name': '检测人员', 'tags': ['倪才倩', '范洁'] },
  ];

  let tempSetting = [...defaultSetting];

  const [current, setCurrent] = useState();
  const [temp, setTemp] = useState(); 

  const hostname = window.location.hostname;
  const url = `http://${hostname}/setting/`;
  // const csrftoken = new Cookies();

  // update to temp
  const updateTemp = data => {
    setTemp(data);
    setCurrent(data);
    return data;
  };

  // get setting JSON from backend
  const getSetting = () => {
    fetch(url)
      .then(res => res.json())
      .then(updateTemp)
      .then((res) => console.log('Get Setting:', res))
      .catch(console.error);
  };

  // post current setting to backend
  const postSetting = () => {
    fetch(url, {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-Type': 'application/json; charset=UTF-8',
        // 'X-CSRFToken': csrftoken
      },
      body: JSON.stringify(current)
    })
      .then(res => res.json())
      .then((res) => console.log('Post Setting:', res))
      .catch(console.error);
  };

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
    setTemp([...tempSetting]);
    setCurrent([...tempSetting]);
  };

  // save default setting to current
  const getDefault = () => {
    setTemp([...defaultSetting]);
  };

  // get setting from backend
  useEffect(() => {
    getSetting();
  }, []);

  // update setting to state of App component, post current setting to backend
  useLayoutEffect(() => {
    if (current) {
      onUpdateSetting(current);
      postSetting();
    };
  }, [current]);

  return (
    <>
      <Button onClick={cancelTemp}>撤销</Button>  （点击“撤销”返回至上次保存状态）
      <Button onClick={ saveCurrent }>保存</Button> （点击“保存”使当前显示设置生效！）
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
