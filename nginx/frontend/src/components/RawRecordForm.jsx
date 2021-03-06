import React, { useState } from 'react';

import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import Select from 'antd/lib/select';

import post from '../helpers/apiPost';

const { Option } = Select;


export default function RawRecordForm({ start, setting, data }) {

  const hostname = window.location.hostname;
  const url = `http://${hostname}/api/series/`;

  const layout = {
    labelCol: {span: 6,},
    wrapperCol: {span: 12,},
  };
  const tailLayout = {
    wrapperCol: {offset: 6,span: 16,},
  };
  const [form] = Form.useForm();

  const [state, setState] = useState({
    name: null,
    projectName: null,
    method: null,
    instrumentName: null,
    assetNumber: null,
    balanceFlow: null,
    ambTemp: null,
    ambRh: null,
    ambPress: null,
    stv: null,
    noxRange: null,
    aveTime: null,
    noBkg: null,
    noxBkg: null,
    noCoef: null,
    no2Coef: null,
    noxCoef: null,
  });

  const noxItems = [
    'noxRange', 
    'aveTime', 
    'noBkg', 
    'noxBkg', 
    'noCoef', 
    'no2Coef', 
    'noxCoef'
  ];

  const onChangeRange = e => {
    const value = e.target.value;
    const newState = { ...state };
    newState['noxRange'] = value;
    setState(newState);
  };

  const onChangeAveTime = e => {
    const value = e.target.value;
    const newState = { ...state };
    newState['aveTime'] = value;
    setState(newState);
  };

  const onChangeNoBkg = e => {
    const value = e.target.value;
    const newState = { ...state };
    newState['noBkg'] = value;
    setState(newState);
  };

  const onChangeNoxBkg = e => {
    const value = e.target.value;
    const newState = { ...state };
    newState['noxBkg'] = value;
    setState(newState);
  };

  const onChangeNoCoef = e => {
    const value = e.target.value;
    const newState = { ...state };
    newState['noCoef'] = value;
    setState(newState);
  };

  const onChangeNo2Coef = e => {
    const value = e.target.value;
    const newState = { ...state };
    newState['no2Coef'] = value;
    setState(newState);
  };

  const onChangeNoxCoef = e => {
    const value = e.target.value;
    const newState = { ...state };
    newState['noxCoef'] = value;
    setState(newState);
  };

  const handleNoxData = data => {
    const d = new Date();
    const newState = {...state};
    noxItems.forEach(item => newState[item] = data['nox'][item]);
    setState(newState)
    console.log(d.toISOString(), "RawRecordForm new state:", newState);
  };

  const handleFetch = () => {
    if (!start) {
      alert("开始运行才能获取数据");
    } else if (!data) {
      alert("无法获取数据，请检查设备");
    } else {
      handleNoxData(data);
    };
  };

  const onFinish = (value) => {
    console.log(value);
  };

  return (
    <Form
      {...layout}
      form={form}
      name="control-hooks" 
      onFinish={onFinish}
    >
      <Form.Item name="projectName" label="项目名称">
        <Select placeholder={"项目名称"}>
          {setting['projectName'].map((item, index) => <Option key={index} value={item}>{item}</Option>)}
        </Select>
      </Form.Item>

      <Form.Item name="method" label="分析方法">
        <Select placeholder={"分析方法"}>
          {setting['method'].map((item, index) => <Option key={index} value={item}>{item}</Option>)}
        </Select>
      </Form.Item>

      <Form.Item name="instrumentName" label="仪器名称及型号">
        <Select placeholder={"仪器名称及型号"}>
          {setting['instrumentName'].map((item, index) => <Option key={index} value={item}>{item}</Option>)}
        </Select>
      </Form.Item>
      
      <Form.Item name="assetNumber" label="固定资产登记号">
        <Select placeholder={"固定资产登记号"}>
          {setting['assetNumber'].map((item, index) => <Option key={index} value={item}>{item}</Option>)}
        </Select>
      </Form.Item>

      <Form.Item name="balanceFlow" label="平衡气流">
        <Input placeholder="平衡气流 (ml/min)" />
      </Form.Item>

      <Form.Item name="ambTemp" label="室温">
        <Input placeholder="室温 (摄氏度)" />
      </Form.Item>

      <Form.Item name="ambRh" label="相对湿度">
        <Input placeholder="相对湿度 (%)" />
      </Form.Item>

      <Form.Item name="ambPress" label="大气压">
        <Input placeholder="大气压 (Mpa)" />
      </Form.Item>

      <Form.Item name="stv" label="STV">
        <Input placeholder="数据稳定判断值" />
      </Form.Item>

      <Form.Item name="onChangeRange" label="量程">
        <Input
          placeholder="量程 (PPM)"
          defaultValue={state['noxRange']}
          onChange={onChangeRange}
        />
      </Form.Item>
      
      <Form.Item name="aveTime" label="平均时间">
        <Input
          placeholder={state['aveTime'] ? state['aveTime'] : "平均时间 (Sec)"}
          defaultValue={state['aveTime']}
          onChange={onChangeAveTime}
        />
      </Form.Item>

      <Form.Item name="noBkg" label="NO BKG">
        <Input
          placeholder={state['noBkg'] ? state['noBkg'] : "NOx BKG (PPM)"}
          defaultValue={state['noBkg']}
          onChange={onChangeNoBkg}
        />
      </Form.Item>

      <Form.Item name="noxBkg" label="NOx BKG">
        <Input
          placeholder={state['noxBkg'] ? state['noxBkg']: "NOx BKG (PPM)"}
          defaultValue={state['noxBkg']}
          onChange={onChangeNoxBkg}
        />
      </Form.Item>

      <Form.Item name="noCoef" label="NO Coef">
        <Input
          placeholder={state['noCoef'] ? state['noCoef'] : "NO Coef"}
          defaultValue={state['noCoef']}
          onChange={onChangeNoCoef}
        />
      </Form.Item>

      <Form.Item name="no2Coef" label="NO2 Coef">
        <Input
          placeholder={state['no2Coef'] ? state['no2Coef'] : "NO2 Coef"}
          defaultValue={state['no2Coef']}
          onChange={onChangeNo2Coef}
        />
      </Form.Item>

      <Form.Item name="noxCoef" label="NOx Coef">
        <Input
          placeholder={state['noxCoef'] ? state['noxCoef'] : "NOx Coef"}
          defaultValue={state['noxCoef']}
          onChange={onChangeNoxCoef}
        />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button htmlType="button" onClick={handleFetch}>
          获取状态
        </Button>
        <Button type="primary" htmlType="submit">
          保存记录
        </Button>
      </Form.Item>
    </Form>
  );
};
