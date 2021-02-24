import React, { useState } from 'react';
import Table from 'antd/lib/table';

export default function SeriesTable () {

  const data = [
    {
      key: '1',
      row: 1,
      type: '校准'
    },
    {
      key: '2',
      row: 2,
      type: '质控',
    },
  ];

  const [state, setState] = useState(data)  

  const columns = [
    {
      title: '行',
      dataIndex: 'row',
      key: 'row',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '样品名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '样品位置',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: '样品编号',
      dataIndex: 'sampleID',
      key: 'sampleID',
    },
    {
      title: 'NO浓度',
      dataIndex: 'noInput',
      key: 'noInput',
    },
    {
      title: '偏差',
      dataIndex: 'bias',
      key: 'bias',
    },
    {
      title: '气瓶类型',
      dataIndex: 'bottleType',
      key: 'bottleType',
    },
    {
      title: '气瓶压力',
      dataIndex: 'bottlePres',
      key: 'bottlePres',
    },
    {
      title: '检测人员',
      dataIndex: 'operator',
      key: 'operator',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={state}
      pagination={false}
      size="middle"
      // bordered
      // scroll={{ x: 'calc(700px + 50%)', y: 240 }}
    />
  );
};
