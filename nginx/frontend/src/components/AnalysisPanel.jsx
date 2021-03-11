import React, { useState, useEffect } from 'react';

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

import useInterval from '../hooks/useInterval';


export default function AnalysisPanel({
  start,
  data,
  seriesName,
  series
}) {

  // const purgeTime = 3 * 60;   // purge interval in (sec)
  // const noxInterval = 8;      // interval in (sec)
  // const noxCountLimit = 18;   // up limit number of data

  // for testing
  const purgeTime = 10;   // purge interval in (sec)
  const noxInterval = 2;      // interval in (sec)
  const noxCountLimit = 18;   // up limit number of data

  const [tableData, setTableData] = useState();
  const [analyzing, setAnalyzing] = useState(false);
  const [purging, setPurging] = useState(false);

  let n = 0;      // analyzing time in (sec)
  let count = 0;  // NOx data checking point number
  let c1 = 0;
  let c2 = 0;
  let c3 = 0;
  let analysisIndex = -1;

  // init table
  useEffect(() => {
    if (series) {
      const newData = series.map((item, index) => {
        const newItem = { ...item };
        newItem['key'] = index;
        newItem['status'] = 'waiting';
        newItem['series'] = seriesName;
        return newItem;
      });
      setTableData(newData);
    };
  }, [series])

  const initAnalysis = () => {
    analysisIndex = 0;
    c1 = 0; c2 = 0; c3 = 0;
  };

  // arithmetic mean
  const getMean = data => {
    return data.reduce(function (a, b) {
      return Number(a) + Number(b);
    }) / data.length;
  };

  // standard deviation
  const getSD = data => {
    let m = getMean(data);
    return Math.sqrt(data.reduce(function (sq, n) {
      return sq + Math.pow(n - m, 2);
    }, 0) / (data.length - 1));
  };

  const checkPurge = n => n >= purgeTime;

  const checkNewPoint = () => (n - purgeTime) % noxInterval === 0;

  const getBias = () => parseFloat(series[analysisIndex]['bias']) / 100.0;

  const checkStatble = () => {
    // get NOx data, calculate derived parameters based on NOx
    const newNoxData = data['nox'];
    c1 = c2;
    c2 = c3;
    c3 = newNoxData['no'];
    const s = getSD([c1, c2, c3]);
    const RSD = s / getMean([c1, c2, c3]);
    const bias = getBias();
    console.log(`AnalysisPanel checkStable: c1 ${c1}, c2 ${c2}, c3 ${c3}, RSD ${RSD}, bias limit ${bias}`);
    return (RSD < bias) || (count >= noxCountLimit);
  };

  const recordAndPostNox = () => {
    count = 0;
    analysisIndex += 1;
    console.log(`AnalysisPanel recordAndPostNox`)
  };

  const cleanUp = () => {
    n = 0; 
    analysisIndex = -1;
    setAnalyzing(false);
    alert("已停止或完成分析");
  };

  // analyzing
  useInterval(() => {
    console.log(`AnalysisPanel analyzing: n ${n}, count ${count}`);

    if (n === 0) {
      initAnalysis();
    };

    if (checkPurge()) {
      setPurging(true);
    } else {
      setPurging(false);
      if (checkNewPoint()) {
        count += 1;
        if (checkStatble()) {
          recordAndPostNox();
        };
      };
    };

    n += 1;

    if (analysisIndex >= series.length) {
      cleanUp();
    };
    
  }, analyzing ? 1000 : null);

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

  const startAnalysis = () => {
    setAnalyzing(true);
  };

  const stopAnalysis = () => {
    setAnalyzing(false);
    cleanUp();
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
