import React, { useState } from 'react';
import Tabs from 'antd/lib/tabs';
import SettingList from './SettingList'
import SeriesTable from './SeriesTable'
import RawRecordForm from './RawRecordForm';
import AnalysisPanel from './AnalysisPanel';
import ResultTable from './ResultTable';
import ReportPanel from './ReportPanel';

const { TabPane } = Tabs;


export default function TabFrame({
  start,
  setting,
  series,
  data,
  onUpdateSetting=f=>f,
  onSaveSeries=f=>f,
  passAnalyzing=f=>f,
 }) {

  const [seriesName, setSeriesName] = useState();
  const [analyzing, setAnalyzing] = useState(false);

  const passSeriesName = name => {
    setSeriesName(name);
  };

  const receiveAnalyzing = analyzing => {
    setAnalyzing(analyzing);
    passAnalyzing(analyzing);
  };

  return(
    <Tabs defaultActiveKey="6">
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
          passAnalyzing={receiveAnalyzing}
        />
      </TabPane>

      <TabPane tab="数据处理" key="4">
        <ResultTable seriesName={seriesName} />
      </TabPane>

      <TabPane tab="样品查询" key="5">
        <ReportPanel />
      </TabPane>

      <TabPane tab="基本设置" key="6" >
        <SettingList onUpdateSetting={onUpdateSetting} />
      </TabPane>
    </Tabs>
  );
};
