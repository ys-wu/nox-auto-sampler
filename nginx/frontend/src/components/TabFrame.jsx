import React, { useState } from 'react';
import Tabs from 'antd/lib/tabs';
import SettingList from './SettingList'
import SeriesTable from './SeriesTable'
import RawRecordForm from './RawRecordForm';
import AnalysisPanel from './AnalysisPanel';
import ResultTable from './ResultTable';

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
  const [analyzing, setAnalyzing] = useState(false);

  const passSeriesName = name => {
    setSeriesName(name);
  };

  const passAnalyzing = analyzing => {
    setAnalyzing(analyzing);
  };

  return(
    <Tabs defaultActiveKey="5">
      <TabPane tab="序列列表" key="1">
        <SeriesTable
          setting={setting}
          analyzing={analyzing}
          onSaveSeries={onSaveSeries}
          passSeriesName={passSeriesName}
        />
      </TabPane>
      <TabPane tab="原始记录" key="2">
        <RawRecordForm
          start={start}
          data={data}
          seriesName={seriesName}
          setting={setting} 
        />
      </TabPane>
      <TabPane tab="分析检测" key="3">
        <AnalysisPanel
          start={start}
          data={data}
          seriesName={seriesName}
          series={series}
          passAnalyzing={passAnalyzing}
        />
      </TabPane>
      <TabPane tab="数据处理" key="4">
        <ResultTable />
      </TabPane>
      <TabPane tab="设置" key="5" >
        <SettingList onUpdateSetting={onUpdateSetting} />
      </TabPane>
    </Tabs>
  );
};
