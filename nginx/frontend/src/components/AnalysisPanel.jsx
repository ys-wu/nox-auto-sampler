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

  const purgeTime = 10;   // purge interval in (sec)
  const noxInterval = 4;      // interval in (sec)
  const noxCountLimit = 5;   // up limit number of data

  const [timeCounter, setTimeCounter] = useState(0);    // analyzing time in (sec)
  const [noxCounter, setNoxCounter] = useState(0);      // NOx data checking point number
  const [noxCache, setNoxCache] = useState([0, 0, 0]);
  const [analysisIndex, setAnalysisIndex] = useState(0);
  const [tableData, setTableData] = useState();
  const [analyzing, setAnalyzing] = useState(false);
  const [purging, setPurging] = useState(false);

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
    setTimeCounter(1);
    setNoxCache([0, 0, 0]);
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

  const checkPurge = () => timeCounter < purgeTime;

  const checkNewPoint = () => (timeCounter - purgeTime) % noxInterval === 0;

  const getBias = () => parseFloat(series[analysisIndex]['bias']) / 100.0;

  const checkStatble = () => {
    // get NOx data, calculate derived parameters based on NOx
    const newNoxData = data['nox'];
    const c1 = noxCache[1];
    const c2 = noxCache[2];
    const c3 = newNoxData['no'];
    setNoxCache([c1, c2, c3]);
    const s = getSD([c1, c2, c3]);
    const mean = getMean([c1, c2, c3]);
    if (mean === 0) {
      alert("NOx 测量错误！已停止分析！");
      cleanUp();
    };
    const RSD = s / mean;
    const bias = getBias();
    if (Number.isNaN(bias)) {
      alert("偏差设置错误！已停止分析！");
      cleanUp();
    }
    console.log(`AnalysisPanel checkStable: c1 ${c1}, c2 ${c2}, c3 ${c3}, RSD ${RSD}, bias limit ${bias}`);
    return (RSD < bias) || (noxCounter >= noxCountLimit);
  };

  const handleStableData = () => {
    setTimeCounter(0);
    setNoxCounter(0);
    setAnalysisIndex(analysisIndex + 1);
    console.log(`AnalysisPanel handleStableData`)
  };

  const cleanUp = () => {
    setAnalyzing(false);
    setTimeCounter(0);
    setNoxCounter(0);
    setAnalysisIndex(0);
  };

  // analyzing
  useInterval(() => {
    const d = new Date();
    console.log(`${d.toISOString()} AnalysisPanel analyzing: timeCounter ${timeCounter}, noxCounter ${noxCounter}, analysisIndex ${analysisIndex}`);

    if (timeCounter === 0) {
      initAnalysis();
    } else {
      if (checkPurge()) {
        console.log(`${d.toISOString()} AnalysisPanel analyzing: purging`);
        setPurging(true);
        setTimeCounter(timeCounter + 1);
      } else {
        setPurging(false);
        if (checkNewPoint()) {
          if (checkStatble()) {
            console.log(`${d.toISOString()} AnalysisPanel analyzing: get stable data`);
            handleStableData();
          } else {
            console.log(`${d.toISOString()} AnalysisPanel analyzing: stablizing`);
            setTimeCounter(timeCounter + 1);
            setNoxCounter(noxCounter + 1);
          };
        } else {
          setTimeCounter(timeCounter + 1);
        };
      };
    };

    if (analysisIndex >= series.length) {
      cleanUp();
      alert("已完成分析");
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
    cleanUp();
    alert("已停止分析");
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
