import React, { useState } from 'react';
import Tabs from 'antd/lib/tabs';
import SettingList from './SettingList'
import SeriesTable from './SeriesTable'
import RawRecordForm from './RawRecordForm';
import AnalysisPanel from './AnalysisPanel';

const { TabPane } = Tabs;


export default function TabFrame({
  start,
  setting,
  series,
  data,
  onUpdateSetting=f=>f,
  onSaveSeries=f=>f,
 }) {

  const [seriesName, setSeriesName] = useState();

  const passSeriesName = name => {
    setSeriesName(name);
  };

  return(
    <Tabs defaultActiveKey="6">
      <TabPane tab="序列列表" key="1">
        <SeriesTable
          setting={setting}
          onSaveSeries={onSaveSeries}
          passSeriesName={passSeriesName}
        />
      </TabPane>
      <TabPane tab="原始记录" key="2">
        <RawRecordForm start={start} data={data} setting={setting} />
      </TabPane>
      <TabPane tab="分析检测" key="3">
        <AnalysisPanel
          start={start}
          data={data}
          seriesName={seriesName}
          series={series}
        />
      </TabPane>
      <TabPane tab="数据处理" key="4">
        Content of Tab Pane
      </TabPane>
      <TabPane tab="报表" key="5">
        Content of Tab Pane
      </TabPane>
      <TabPane tab="设置" key="6" >
        <SettingList onUpdateSetting={onUpdateSetting} />
      </TabPane>
    </Tabs>
  );
};
