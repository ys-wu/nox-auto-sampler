import React, { useState, useMemo} from 'react';
import './SettingList.css'
import Button from 'antd/lib/button';
import List from 'antd/lib/list';
import EditableTagGroup from './EditableTagGroup'


export default function SettingList() {

  let tempSetting = [
    { 'name': '类型', 'tags': ['校准', '质控', '样品'] },
    { 'name': '偏差', 'tags': ['0.1 %', '0.5 %', '1 %'] },
    {
      'name': '气瓶类型',
      'tags': ['美托 2 升', '美托 4 升', '美托 8 升', '科金 2 升', '科金 4 升', '科金 8 升']
    },
    { 'name': '气瓶压力', 'tags': ['11.0 MPa', '10.9 MPa', '10.8 MPa', '10.7 MPa'] },
    { 'name': '检测人员', 'tags': ['倪才倩', '范洁'] },
  ];

  const [current, setCurrent] = useState([...tempSetting]);
  const [temp, setTemp] = useState([...tempSetting]); 

  let defaultSetting = [
    { 'name': '类型', 'tags': ['校准', '质控', '样品'] },
    { 'name': '偏差', 'tags': ['0.1 %', '0.5 %', '1 %'] },
    {
      'name': '气瓶类型',
      'tags': ['美托 2 升', '美托 4 升', '美托 8 升', '科金 2 升', '科金 4 升', '科金 8 升']
    },
    { 'name': '气瓶压力', 'tags': ['11.0 MPa', '10.9 MPa', '10.8 MPa', '10.7 MPa'] },
    { 'name': '检测人员', 'tags': ['倪才倩', '范洁'] },
  ];

  const onUpdate = function(name, tags) {
    tempSetting = tempSetting.map(
      item => item['name'] !== name ? item : {name : name, 'tags': tags }
     );
  };
  
  const cancelTemp = () => {
    setTemp([...current]);
  };

  const saveCurrent = () => {
    setCurrent([...tempSetting]);
    setTemp([...tempSetting]);
  };

  const getDefault = () => {
    setTemp([...defaultSetting]);
  };

  return (
    <>
      <Button onClick={cancelTemp}>撤销</Button>  （返回至上次保存状态）
      <Button onClick={ saveCurrent }>保存</Button> （保存使当前显示设置生效！）
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
