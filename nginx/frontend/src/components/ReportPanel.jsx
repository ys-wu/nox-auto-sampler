import React, { useState, useEffect } from 'react';

import Row from 'antd/lib/row'
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import Table from 'antd/lib/table';
import Popconfirm from 'antd/lib/popconfirm';

import get from '../helpers/apiGet';
import post from '../helpers/apiPost';


export default function ReporPanel() {

  const [form] = Form.useForm();

  const [sampleId, setSampleId] = useState();
  const [tableData, setTabledata] = useState([]);

  const hostname = window.location.hostname;
  const port = window.location.port;
  // const urlSample = `http://${hostname}:${port}/api/sample/`
  const urlSample = `http://${hostname}:${port}/api/samplebyid/`
  const urlReport = `http://${hostname}:${port}/api/sample_report/`;

  const onFinish = value => {
    setSampleId(value['sampleId']);
  };

  const updateTable = data => {
    const samples = data.filter(item => item['sampleId'] === sampleId);
    setTabledata(samples);
    return data;
  };

  useEffect(() => {
    get(urlSample + sampleId + '/', updateTable);
  }, [sampleId]);

  const columns = [
    {
      title: '序列名称',
      dataIndex: 'series',
      key: 'series',
      render: value => value
    },
    {
      title: 'NO 浓度',
      dataIndex: 'noInputConc',
      key: 'noInputConc',
      render: value => value ? value.toFixed(2) : null
    },
    {
      title: 'NOx 浓度',
      dataIndex: 'noxInputConc',
      key: 'noxInputConc',
      render: value => value ? value.toFixed(2) : null
    },
    {
      title: 'NO 修正值',
      dataIndex: 'noRevised',
      key: 'noRevised',
      render: value => value ? value.toFixed(2) : null
    },
    {
      title: 'NOx 修正值',
      dataIndex: 'noxRevised',
      key: 'noxRevised',
      render: value => value ? value.toFixed(2) : null
    },
  ];

  const onGetReports = () => {
    post(sampleId, urlReport);
  };

  return (
    <>
      <Form form={form} layout="inline" onFinish={onFinish}>
        <Form.Item name="sampleId" label="样品编号">
          <Input
            style={{ width: 200 }}
            allowClear
            placeholder="请输入"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            确定
          </Button>
        </Form.Item>
      </Form>

      {
        tableData.length < 1 ? null :
        <>
          <Row>
            <Table
              pagination={false}
              columns={columns}
              dataSource={tableData}
            />
          </Row>

          {/* <Popconfirm title="确认提交?">
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
          </Popconfirm> */}
        </>
      }
    </>
  );
};
