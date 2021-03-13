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

import get from '../helpers/apiGet';
import post from '../helpers/apiPost';


export default function AnalysisPanel({
  start,
  data,
  seriesName,
  series,
  passAnalyzing = f => f,
}) {

  const purgeTime = 10;   // purge interval in (sec)
  const noxInterval = 4;      // interval in (sec)
  const noxCountLimit = 5;   // up limit number of data

  const hostname = window.location.hostname;
  const urlSeries = `http://${hostname}/api/series/`;
  const urlSample = `http://${hostname}/api/sample/`;
  const urlAnalyzing = `http://${hostname}/api/analyzing/`;
  const urlPurging = `http://${hostname}/api/purging/`;

  const [timeCounter, setTimeCounter] = useState(0);    // analyzing time in (sec)
  const [noxCounter, setNoxCounter] = useState(0);      // NOx data checking point number
  const [noxCache, setNoxCache] = useState([0, 0, 0]);
  const [analysisIndex, setAnalysisIndex] = useState(0);
  const [tableData, setTableData] = useState();
  const [analyzing, setAnalyzing] = useState(false);
  const [purging, setPurging] = useState(false);
  const [noxCoef, setNoxCoef] = useState([1, 1, 1]);

  const init = () => {
    if (series) {
      const newData = series.map((item, index) => {
        const newItem = { ...item };
        newItem['key'] = index;
        newItem['status'] = 'waiting';
        newItem['series'] = seriesName;
        newItem['no2InputConc'] = newItem['noxInputConc'] - newItem['noInputConc'];
        return newItem;
      });
      setTableData(newData);
      cleanUp();
      setAnalysisIndex(0);
    };
  };

  useEffect(() => {
    init();
  }, [series]);

  useEffect(() => {
    init();
  }, [seriesName]);

  const setStatus = (index, status) => {
    const newData = [...tableData];
    if (index > 0) {
      const lastLine = { ...newData[index - 1] };
      lastLine["status"] = "finished";
      newData[index-1] = lastLine;
    };
    const newLine = { ...newData[index]};
    newLine["status"] = status;
    newData[index] = newLine;
    setTableData(newData);
  };

  useEffect(() => {
    if (series) {
      if (analysisIndex < series.length) {
        if (purging) {
          post({ analyzing: "true" }, urlAnalyzing);
          post({ purging: "true" }, urlPurging);
          setStatus(analysisIndex, "purging");
        } else if (analyzing && timeCounter > 1) {
          post(
            {
              analyzing: "true",
              valve: tableData[analysisIndex]['position'],
            },
            urlAnalyzing
          );
          post({ purging: "false" }, urlPurging);
          setStatus(analysisIndex, "analyzing");
        } else {
          post({ analyzing: "false" }, urlAnalyzing);
        };
      } else {
        setStatus(analysisIndex - 1, "finished");
        cleanUp();
      };
    };
  }, [timeCounter]);

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
      setStatus(analysisIndex, "stopped");
      cleanUp();
    };
    const RSD = s / mean;
    const bias = getBias();
    if (Number.isNaN(bias)) {
      alert("偏差设置错误！已停止分析！");
      setStatus(analysisIndex, "stopped");
      cleanUp();
    }
    console.log(`AnalysisPanel checkStable: c1 ${c1}, c2 ${c2}, c3 ${c3}, RSD ${RSD}, bias limit ${bias}`);
    return (RSD < bias) || (noxCounter >= noxCountLimit);
  };

  const calculateNoxCoef = () => {
    const no = parseFloat(data["nox"]["no"]);
    const nox = parseFloat(data["nox"]["nox"]);
    const stdNo = parseFloat(series[analysisIndex]["noInputConc"]);
    const stdNox = parseFloat(series[analysisIndex]["noxInputConc"]);
    const noCoef = stdNo / no;
    const no2Coef = (stdNox - stdNo) / (nox - no);
    const noxCoef = stdNox / nox;
    setNoxCoef([noCoef, no2Coef, noxCoef]);
    return [noCoef, no2Coef, noxCoef];
  };

  const deriveData = coefs => {
    const newData = {...series[analysisIndex]};
    const noxAnalyzer = {...data["nox"]};
    const no = parseFloat(noxAnalyzer["no"]);
    const nox = parseFloat(noxAnalyzer["nox"]);
    newData["index"] = analysisIndex;
    newData["series"] = seriesName;
    newData["noMeasConc"] = no;
    newData["no2MeasConc"] = nox - no;
    newData["noxMeasConc"] = nox;
    newData["noMeasCoef"] = coefs[0];
    newData["no2MeasCoef"] = coefs[1];
    newData["noxMeasCoef"] = coefs[2];
    newData["noRevised"] = no * coefs[0];
    newData["no2Revised"] = nox * coefs[2] - no * coefs[0];
    newData["noxRevised"] = nox * coefs[2];
    newData["stable"] = noxCounter >= noxCountLimit ? "true" : "false";
    return newData;
  };

  const updateTableData = data => {
    const newData = [...tableData];
    const newLine = {...newData[analysisIndex]};
    newLine["noMeasConc"] = data["noMeasConc"];
    newLine["no2MeasConc"] = data["no2MeasConc"];
    newLine["noxMeasConc"] = data["noxMeasConc"];
    newLine["noMeasCoef"] = data["noMeasCoef"];
    newLine["no2MeasCoef"] = data["no2MeasCoef"];
    newLine["noxMeasCoef"] = data["noxMeasCoef"];
    newLine["noRevised"] = data["noRevised"];
    newLine["no2Revised"] = data["no2Revised"];
    newLine["noxRevised"] = data["noxRevised"];
    newLine["stable"] = data["stable"];
    newData[analysisIndex] = newLine;
    setTableData(newData);
  };

  const handleStableData = () => {
    let coefs;
    if (series[analysisIndex]["type"] === "校准") {
      coefs = calculateNoxCoef();
    } else {
      if (noxCoef) {
        coefs = [...noxCoef];
      };
    };
    const data = deriveData(coefs);
    updateTableData(data);
    const postData = {...data};
    delete postData.id;
    delete postData.name;
    post(postData, urlSample);
    setTimeCounter(0);
    setNoxCounter(0);
    setAnalysisIndex(analysisIndex + 1);
    console.log(`AnalysisPanel handleStableData`)
  };

  const cleanUp = () => {
    setAnalyzing(false);
    setTimeCounter(0);
    setNoxCounter(0);
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
  }, analyzing ? 1000 : null);

  const columns = [
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: status => {
        if (status === 'waiting') {
          return <Tag icon={<ClockCircleOutlined />} color="default">待分析</Tag>
        } else if (status === 'purging') {
          return <Tag icon={<SyncOutlined spin />} color="processing">吹扫中</Tag>
        } else if (status === 'analyzing') {
          return <Tag icon={<SyncOutlined spin />} color="processing">分析中</Tag>
        } else if (status === 'finished') {
          return <Tag icon={<CheckCircleOutlined />} color="success">已分析</Tag>
        } else if (status === 'stopped') {
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
    get(
      urlSeries,
      data => {
        const nameList = data["results"].map(item => item["name"]);
        const index = nameList.indexOf(seriesName);
        if (index >= 0) {
          setAnalyzing(true);
        } else {
          alert(`不存在序列文件 ${seriesName}`)
        };
      },
    );
  };

  const stopAnalysis = () => {
    setAnalyzing(false);
    setPurging(false);
    setTimeCounter(0);
    setNoxCounter(0);
    setStatus(analysisIndex, "stopped");
  };

  return (
    <>
      {
        !start ? <p>设备未连接</p> : 
        <>
          <Row style={{ paddingBottom: 10 }}>
            { !analyzing ? 
              <Button
                style={{
                  height: 40,
                  fontSize: "1.2em",
                  color: "DarkBlue",
                  width: 150,
                  float: "left"
                }}
                onClick={startAnalysis}
              >
                {series && analysisIndex >= series.length ? "已完成分析" : "开始分析"}
              </Button> :
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
            }
          </Row>
          
          <Table pagination={false} columns={columns} dataSource={tableData} />
        </>
      }
    </>
  );
};
