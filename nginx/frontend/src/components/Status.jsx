import React, { useState, useRef } from 'react';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Tag from 'antd/lib/tag';
import Divider from 'antd/lib/divider';
import Switch from 'antd/lib/switch';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';


export default function Status({ data, switchSampling=f=>f, triggerMock=f=>f} ) {

  const [form] = Form.useForm();

  const [start, setStart] = useState(false);
  const [state, setState] = useState();
  const txtLog = useRef();

  const hostname = window.location.hostname;
  const url = `http://${hostname}/log/`

  // command in log input to trigger mock UI
  const password = 'a';

  // handle start button
  const handleStart = checked => {
    const d = new Date();
    setStart(checked);
    console.log(d.toISOString(), "Status start buttom has been clicked, checked:", checked);
    switchSampling(checked);
  };

  // handle change on log input
  const onChange = e => {
    const value = e.target.value;
    setState(value);
    console.log(value)
  }; 

  // post log to backend
  const postLog = (data) => {
    const d = new Date();
    console.log(d.toISOString(), 'Status post log:', data);
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
      .then((res) => console.log(d.toISOString(), 'Status post response:', res))
      .catch(console.error);
  };

  // handle submit log text
  const onFinish = value => {
    const d = new Date();
    if (state === password) {
      triggerMock();
      console.log(d.toISOString(), "Status trigger mock");
    } else {
      postLog({ log: state });
      console.log(d.toISOString(), "Status submit a log:", state);
    };
    form.resetFields();
  };

  return (
    <>
      <Divider orientation="left">系统状态</Divider>
      <Row>
        <Col span={3} style={{ textAlign: "center" }}>
          <Switch checkedChildren="开始" unCheckedChildren="停止" onClick={handleStart} />
        </Col>
        {
          data === null
            ? 
          ( start ? <p>无法获取数据</p> : null )
            : 
          <>
            <Col span={2} style={{ textAlign: "center" }}>
              <Tag color="#2db7f5">运行中</Tag>
            </Col>
            <Col span={3} style={{ textAlign: "center" }}>
              <Tag>设定流量</Tag>
            </Col> 
            <Col span={3} style={{ textAlign: "center" }}>
              <Tag>流量: {data['mfc']['read']} L/min</Tag>
            </Col>
            <Col span={3} style={{ textAlign: "center" }}>
              <Tag>阀门: {data['valve'] < 0 ? '关闭' : data['valve'] + "号"}</Tag>
            </Col>
            <Col span={3} style={{ textAlign: "center" }}>
              <Tag>NO: {data['nox']['no']} ppm</Tag>
            </Col>
            <Col span={3} style={{ textAlign: "center" }}>
              <Tag>NOx: {data['nox']['nox']} ppm</Tag>
            </Col>
          </>
        }
      </Row>
      <Row style={{ paddingTop:20 }}>
        <Col span={20} offset={2} style={{ textAlign: "center" }}>
          <Form form={form} layout="inline" onFinish={onFinish}>
            <Form.Item name="log" label="日志">
              <Input allowClear placeholder="手动输入一行日志" ref={txtLog} value={state} onChange={onChange} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                提交
            </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
      <Divider orientation="left"></Divider>
    </>
  )
}


