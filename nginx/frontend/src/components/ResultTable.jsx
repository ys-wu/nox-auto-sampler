import React, { useState, useEffect } from 'react';

import Row from 'antd/lib/row';
import Form from 'antd/lib/form';
import Select from 'antd/lib/select';
import Button from 'antd/lib/button';
import Table from 'antd/lib/table';
import Popconfirm from 'antd/lib/popconfirm';

import get from '../helpers/apiGet';
import post from '../helpers/apiPost';


export default function ResultTable({seriesName}) {

  const { Option } = Select;
  const [form] = Form.useForm();

  const hostname = window.location.hostname;
  const port = window.location.port;
  // const urlSeries = `http://${hostname}:${port}/api/series/`;
  const urlSeriesNames = `http://${hostname}:${port}/api/seriesnames/`;
  const urlSample = `http://${hostname}:${port}/api/sample/`;
  const urlSampleByName = `http://${hostname}:${port}/api/samplebyname/`;
  const urlReport = `http://${hostname}:${port}/api/serie_report/`;

  const [series, setSeries] = useState(seriesName);
  const [seriesList, setSeriesList] = useState([seriesName]);
  const [currentSeries, setCurrentSeries] = useState();
  const [tableData, setTableData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    setSeries(seriesName);
  }, [seriesName]);

  const columns = [
    {
      title: '行',
      dataIndex: 'lineNum',
      key: 'lineNum'
    },
    {
      title: '类型',
      dataIndex: 'sampleType',
      key: 'sampleType'
    },
    {
      title: '样品编号',
      dataIndex: 'sampleId',
      key: 'sampleId'
    },
    {
      title: 'NO(制备值)',
      dataIndex: 'noInputConc',
      key: 'noInputConc',
      render: value => value ? value.toFixed(2) : null
    },
    {
      title: 'NO(分析值)',
      dataIndex: 'noMeasConc',
      key: 'noMeasConc',
      render: value => value ? value.toFixed(2) : null
    },
    {
      title: 'NOx(分析值)',
      dataIndex: 'noxMeasConc',
      key: 'noxMeasConc',
      render: value => value ? value.toFixed(2) : null
    },
    {
      title: '偏差',
      dataIndex: 'bias',
      key: 'bias'
    },
    {
      title: 'NO(再校准)',
      dataIndex: 'noRevised',
      key: 'noRevised',
      render: value => value ? value.toFixed(2) : null
    },
    {
      title: 'NO2(再校准)',
      dataIndex: 'no2Revised',
      key: 'no2Revised',
      render: value => value ? value.toFixed(2) : null
    },
    {
      title: 'NOx(再校准)',
      dataIndex: 'noxRevised',
      key: 'noxRevised',
      render: value => value ? value.toFixed(2) : null
    },
    {
      title: '检测日期',
      dataIndex: 'finishedDate',
      key: 'finishedDate'
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark'
    },
  ];

  const updateSeriesList = data => {
    const newList = data.map(item => item['name']);
    setSeriesList(newList);
    return data;
  };

  const onGetSeries = () => {
    get(urlSeriesNames, updateSeriesList);
  };

  const onSelect = value => {
    setSeries(value);
  };

  const updateTable = data => {
    let newTableData = data.filter(item => item['series'] === series);
    newTableData.sort((a, b) => (a.index > b.index) ? 1 : -1);
    newTableData = newTableData.map((item, index) => {
      const newItem = {...item};
      newItem['lineNum'] = index + 1;
      newItem['key'] = index;
      const t = new Date(Date.parse(item['created']));
      const strDate = `${t.getFullYear()}-${t.getMonth() + 1}-${t.getDate()}`;
      newItem['finishedDate'] = strDate;
      return newItem;
    });
    setTableData(newTableData);
    return data;
  };

  const onFinish = () => {
    setCurrentSeries(series);
    get(urlSampleByName + series + '/', updateTable);
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(selectedRowKeys);
    },
  };

  const calcCoefs = stdList => {
    const NoStds = stdList.map(index => tableData[index]['noInputConc']);
    const NoxStds = stdList.map(index => tableData[index]['noxInputConc']);
    const NoReads = stdList.map(index => tableData[index]['noMeasConc']);
    const NoxReads = stdList.map(index => tableData[index]['noxMeasConc']);
    const NoCoefs = stdList.map((_, index) => NoStds[index] / NoReads[index]);
    const NoxCoefs = stdList.map((_, index) => NoxStds[index] / NoxReads[index]);
    const aveNoCoef = NoCoefs.reduce((a, b) => a + b, 0) / stdList.length;
    const aveNoxCoef = NoxCoefs.reduce((a, b) => a + b, 0) / stdList.length;
    return [aveNoCoef, aveNoxCoef];
  };

  const reCalcTableData = (stdList, noCoef, noxCoef) => {
    const newData = tableData.map((item, index) => {
      if (selectedRows.includes(index)) {
        const newItem = {...item};
        newItem['noRevised'] = item['noMeasConc'] * noCoef;
        if (item['noxInputConc'] !== null) {
          newItem['noxRevised'] = item['noxMeasConc'] * noxCoef;
          newItem['no2Revised'] = newItem['noxRevised'] - newItem['noRevised'];
          newItem['noMeasCoef'] = noCoef;
          newItem['noxMeasCoef'] = noxCoef;
          newItem['no2MeasCoef'] = newItem['no2Revised'] / item['no2MeasConc'];
        } else {
          newItem['noxRevised'] = null;
          newItem['no2Revised'] = null;
          newItem['noMeasCoef'] = noCoef;
          newItem['noxMeasCoef'] = noxCoef;
          newItem['no2MeasCoef'] = null;
        }
        const bias = (newItem['noRevised'] - newItem['noInputConc']) / newItem['noRevised'];
        newItem['bias'] = (bias * 100).toFixed(2) + " %";
        return newItem
      } else {
        return item
      };
    });
    setTableData(newData);
  };

  const onReCal = () => {
    const stdList = selectedRows.filter(item => tableData[item]['sampleType'] === '校准');
    if (selectedRows.length < 1) {
      // alert("请至少选择两行类型为‘校准’的数据");
      alert("请至少选择一行类型为‘校准’的数据");
    } else {
      const [noCoef, noxCoef] = calcCoefs(stdList);
      reCalcTableData(stdList, noCoef, noxCoef);
    };
  };

  const onSave = () => {
    tableData.forEach(item => {
      const newItem = { ...item };
      const d = new Date();
      const id = newItem['id'];
      delete newItem['id'];
      newItem['updateDate'] = d;
      console.log(d.toISOString(), 'Update sample to API:', newItem);
      fetch(`${urlSample}${id}/`, {
        method: "PUT",
        headers: {
          'Accept': 'application/json, text/plain',
          'Content-Type': 'application/json; charset=UTF-8',
          // 'X-CSRFToken': csrftoken
        },
        body: JSON.stringify(newItem)
      })
        .then(res => res.json())
        .then((res) => console.log(d.toISOString(), 'Update response from API:', res))
        .catch(console.error);
    });
  };

  const onGetReports = () => {
    post(currentSeries, urlReport);
  };

  return (
    <>
      <Row style={{ marginTop: 5, marginBottom: 15, marginLeft: 10 }}>
        <Button style={{ marginLeft: 10, marginRight: 10 }} onClick={onGetSeries} >
          获取序列列表
        </Button>
        <Form form={form} layout="inline" onFinish={onFinish}>
          <Form.Item label="选择序列">
            <Select style={{ width: 200, }} defaultValue={series} onSelect={onSelect}>
              {
                seriesList.map((item, index) => <Option
                  key={index}
                  value={item}
                >
                  {item}    
                </Option>) 
              }
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              确定
            </Button>
          </Form.Item>
        </Form>
      </Row>
      { tableData.length > 0 ? 
        <>
          <p>当前查看序列：{currentSeries}</p>

          <Row>
            <Table
              rowSelection={{
                type: 'checkbox',
                ...rowSelection,
              }}
              pagination={false}
              columns={columns}
              dataSource={tableData}
            />
          </Row>

          <Row>
            <Button
              style={{
                height: 35,
                fontSize: "1em",
                color: "DarkBlue",
                width: 120,
                margin: 10,
              }}
              onClick={onReCal}
            >
              重新计算
            </Button>

            <Button
              style={{
                height: 35,
                fontSize: "1em",
                color: "DarkBlue",
                width: 120,
                margin: 10,
              }}
              onClick={onSave}
            >
              保存结果
            </Button>
            
            <Popconfirm title="确认提交?">
              <Button
                style={{
                  height: 35,
                  fontSize: "1em",
                  color: "DarkBlue",
                  width: 120,
                  margin: 10,
                }}
                onClick={onGetReports}
              >
                产生报表
              </Button>
            </Popconfirm>
          </Row>
        </> : null
      }
    </>
  );
};
