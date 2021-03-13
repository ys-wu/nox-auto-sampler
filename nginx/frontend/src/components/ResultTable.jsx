import React, { useState, useEffect } from 'react';

import Row from 'antd/lib/row';
import Form from 'antd/lib/form';
import Select from 'antd/lib/select';
import Button from 'antd/lib/button';
import Table from 'antd/lib/table';

import get from '../helpers/apiGet';
import post from '../helpers/apiPost';


export default function ResultTable() {

  const [form] = Form.useForm();

  const [series, setSeries] = useState();
  const [tableData, setTableData] = useState([
    { operator: 'haha' }
  ]);

  const columns = [
    {
      title: '行',
      dataIndex: 'lineNum',
      key: 'lineNum'
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
      title: '偏差',
      dataIndex: 'bias',
      key: 'bias'
    },
    {
      title: '气瓶压力',
      dataIndex: 'bottleType',
      key: 'bottleType'
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
      title: '备注',
      dataIndex: 'remark',
      key: 'remark'
    },
  ];

  const onGetSeries = {

  };

  const onChange = {

  };

  const onFinish = {

  };

  const onReCal = {

  };


  const onSave = {

  };

  const onGetReports = {

  };

  return (
    <>
      <Row style={{ marginTop: 5, marginBottom: 15, marginLeft: 10 }}>
        <Button style={{ marginLeft: 10, marginRight: 10 }} onClick={onGetSeries} >
          获取序列列表
        </Button>
        <Form form={form} layout="inline" onFinish={onFinish}>
          <Form.Item name="log" label="选择序列">
            <Select style={{ width: 200, }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              确定
            </Button>
          </Form.Item>
        </Form>
      </Row>
      <>
        <Row>
          <Table pagination={false} columns={columns} dataSource={tableData} />
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
            生产报表
          </Button>
        </Row>
      </>
    </>
  );
};
