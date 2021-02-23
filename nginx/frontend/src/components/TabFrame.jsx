import React from 'react';
import Tabs from 'antd/lib/tabs';
import SettingList from './SettingList'

const { TabPane } = Tabs;

export default function Tabframe() {
  return(
    <Tabs defaultActiveKey="1">
      <TabPane tab="序列列表" key="1">
        Content of Tab Pane 1
      </TabPane>
      <TabPane tab="原始记录" key="2">
        Content of Tab Pane 2
      </TabPane>
      <TabPane tab="分析检测" key="3">
        Content of Tab Pane 2
      </TabPane>
      <TabPane tab="数据处理" key="4">
        Content of Tab Pane 2
      </TabPane>
      <TabPane tab="报表" key="5">
        Content of Tab Pane 2
      </TabPane>
      <TabPane tab="设置" key="6">
        <SettingList />
      </TabPane>
    </Tabs>
  );
}
