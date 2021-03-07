import React, { useState, useRef } from 'react';

import Row from 'antd/lib/row';
import Button from 'antd/lib/button';
import Table from 'antd/lib/table';
import Tag from 'antd/lib/tag';
import {
  CheckCircleOutlined,
  SyncOutlined,
  ClockCircleOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';


export default function AnalysisPanel({start, data, series}) {

  // const blankData = {
  //   type: null,
  //   name: null,
  //   position: null,
  //   sampleId: null,
  //   noInputConc: null,
  //   no2InputConc: null,
  //   noMeasConc: null,
  //   no2MeasCoef: null,
  //   noMeasCoef: null,
  //   no2MeasCoef: null,
  //   noRevised: null,
  //   no2Revised: null,
  //   bottlePres: null,
  //   finishedDate: null,
  //   operator: null,
  //   series: null,
  // };

  const columns = [
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: status => {
        if (status == 'waiting') {
          return <Tag icon={<ClockCircleOutlined />} color="default">待分析</Tag>
        } else if (status == 'analyzing') {
          return <Tag icon={<SyncOutlined spin />} color="processing">分析中</Tag>
        } else if (status == 'finished') {
          return <Tag icon={<CheckCircleOutlined />} color="success">已分析</Tag>
        } else if (status == 'stopped') {
          return <Tag icon={<MinusCircleOutlined />} color="default">已停止</Tag>
        };
      }
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: '样品名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '样品位置',
      dataIndex: 'position',
      key: 'position'
    },
    {
      title: '样品编号',
      dataIndex: 'sampleId',
      key: 'sampleId'
    },
    {
      title: 'NO 浓度',
      dataIndex: 'noInputConc',
      key: 'noInputConc'
    },
    {
      title: 'NO2 浓度',
      dataIndex: 'no2InputConc',
      key: 'no2InputConc'
    },
    {
      title: 'NO 原始值',
      dataIndex: 'noMeasConc',
      key: 'noMeasConc'
    },
    {
      title: 'NO2 原始值',
      dataIndex: 'no2MeasCoef',
      key: 'no2MeasCoef'
    },
    {
      title: 'NO 校正系数',
      dataIndex: 'noMeasCoef',
      key: 'noMeasCoef'
    },
    {
      title: 'NO2 校正系数',
      dataIndex: 'no2MeasCoef',
      key: 'no2MeasCoef'
    },
    {
      title: 'NO 修正值',
      dataIndex: 'noRevised',
      key: 'noRevised'
    },
    {
      title: 'NO2 修正值',
      dataIndex: 'no2Revised',
      key: 'no2Revised'
    },
    {
      title: '压力',
      dataIndex: 'bottlePres',
      key: 'bottlePres'
    },
    {
      title: '检测日期',
      dataIndex: 'finishedDate',
      key: 'finishedDate'
    },
    {
      title: '检测人',
      dataIndex: 'operator',
      key: 'operator'
    },
    {
      title: '序列名称',
      dataIndex: 'series',
      key: 'series'
    },
  ];

  const tableData = [
    {
      key: 3,
      status: "finished",
      type: "a",
      name: "b",
    },
    {
      key: 2,
      status: "analyzing",
      type: "a",
      name: "b",
    },
    {
      key: 1,
      status: "waiting",
      type: "a",
      name: "b",
    },
    {
      key: 4,
      status: "stopped",
      type: "a",
      name: "b",
    },
  ];

  const startAnalysis = () => {

  };

  const stopAnalysis = () => {

  };

  return (
    <>
      {
        !start ? <p>设备未连接</p> : 
        <>
          <Row style={{ paddingBottom: 10 }}>
            <Button
              style={{
                height: 40,
                fontSize: "1.2em",
                color: "DarkBlue",
                width: 150,
                float: "left" }}
              onClick={startAnalysis}
            >
              开始分析
            </Button>

            <Button
              style={{
                height: 40,
                fontSize: "1.2em",
                color: "DarkRed",
                width: 150,
                float: "left"
              }}
              onClick={stopAnalysis}
              >
              停止分析
            </Button>
          </Row>
          
          <Table pagination={false} columns={columns} dataSource={tableData} />

          {/* <Row style={{ paddingBottom: 2 }}>
            <Col span={12}>
              <Row>
                <Col style={{ textAlign: "center" }} span={3}>类型</Col>
                <Col style={{ textAlign: "center" }} span={3}>样品名称</Col>
                <Col style={{ textAlign: "center" }} span={3}>样品位置</Col>
                <Col style={{ textAlign: "center" }} span={3}>样品编号</Col>
                <Col style={{ textAlign: "center" }} span={3}>NO 浓度</Col>
                <Col style={{ textAlign: "center" }} span={3}>NO2 浓度</Col>
                <Col style={{ textAlign: "center" }} span={3}>NO 原始值</Col>
                <Col style={{ textAlign: "center" }} span={3}>NO2 原始值</Col>
              </Row>
            </Col>
            <Col span={12}>
              <Row>
                <Col style={{ textAlign: "center" }} span={3}>NO 校正系数</Col>
                <Col style={{ textAlign: "center" }} span={3}>NO2 校正系数</Col>
                <Col style={{ textAlign: "center" }} span={3}>NO 修正值</Col>
                <Col style={{ textAlign: "center" }} span={3}>NO2 修正值</Col>
                <Col style={{ textAlign: "center" }} span={3}>压力</Col>
                <Col style={{ textAlign: "center" }} span={3}>检测日期</Col>
                <Col style={{ textAlign: "center" }} span={3}>检测人</Col>
                <Col style={{ textAlign: "center" }} span={3}>序列名称</Col>
              </Row>
            </Col>
          </Row> */}
        </>
      }
    </>
  );
};
