import React from 'react';
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import Tag from 'antd/lib/tag'
import Divider from 'antd/lib/divider';
import Switch from 'antd/lib/switch';


export default function Status() {
  return (
    <>
      <Divider orientation="left">系统状态</Divider>
      <Row>   
        <Col span={4} style={{ textAlign: "center" }}>
          <Tag color="#2db7f5">空闲</Tag>
        </Col>
        <Col span={4} style={{ textAlign: "center" }}>
          <Tag>NO</Tag>
        </Col>
        <Col span={4} style={{ textAlign: "center" }}>
          <Tag>NOx</Tag>
        </Col>
        <Col span={4} style={{ textAlign: "center" }}>
          <Tag>流量</Tag>
        </Col>
        <Col span={4} style={{ textAlign: "center" }}>
          <Tag>阀门</Tag>
        </Col>
        <Col span={4} style={{ textAlign: "center" }}>
          <Switch checkedChildren="开始" unCheckedChildren="停止" defaultChecked />
        </Col>
      </Row>
      <Divider orientation="left"></Divider>
      {/* <Tag color="magenta">magenta</Tag>
      <Tag color="red">red</Tag>
      <Tag color="volcano">volcano</Tag>
      <Tag color="orange">orange</Tag>
      <Tag color="gold">gold</Tag>
      <Tag color="lime">lime</Tag>
      <Tag color="green">green</Tag>
      <Tag color="cyan">cyan</Tag>
      <Tag color="blue">blue</Tag>
      <Tag color="geekblue">geekblue</Tag>
      <Tag color="purple">purple</Tag>
      <Tag color="#f50">#f50</Tag>
      <Tag color="#87d068">#87d068</Tag>
      <Tag color="#108ee9">#108ee9</Tag>
      <Divider orientation="left"></Divider> */}
    </>
  )
}


