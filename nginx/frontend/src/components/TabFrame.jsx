import React from 'react';
import Tabs from 'antd/lib/tabs';
import SettingList from './SettingList'

const { TabPane } = Tabs;

export default function Tabframe({ onUpdateSetting = f => f }) {
  return(
    <Tabs defaultActiveKey="1">
      <TabPane tab="设置" key="1" >
        <SettingList onUpdateSetting={ onUpdateSetting } />
      </TabPane>
      <TabPane tab="序列列表" key="2">
        Content of Tab Pane 2
      </TabPane>
      <TabPane tab="原始记录" key="3">
        Content of Tab Pane 3
      </TabPane>
      <TabPane tab="分析检测" key="4">
        Content of Tab Pane 4
      </TabPane>
      <TabPane tab="数据处理" key="5">
        Content of Tab Pane 5
      </TabPane>
      <TabPane tab="报表" key="6">
        Content of Tab Pane 6
      </TabPane>
    </Tabs>
  );
}
