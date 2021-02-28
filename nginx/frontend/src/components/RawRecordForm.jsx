import React, { useState } from 'react';

import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import Select from 'antd/lib/select';

import post from '../helpers/apiPost';

const { Option } = Select;


export default function RawRecordForm({ start, setting, data }) {

  const hostname = window.location.hostname;
  const url = `http://${hostname}/api/series/`;

  const layout = {
    labelCol: {span: 6,},
    wrapperCol: {span: 12,},
  };
  const tailLayout = {
    wrapperCol: {offset: 6,span: 16,},
  };
  const [form] = Form.useForm();

  const [noxData, setNoxData] = useState();
  const [state, setState] = useState({
    name: null,
    projectName: null,
    method: null,
    instrumentName: null,
    assetNumber: null,
    balanceFlow: null,
    ambTemp: null,
    ambRh: null,
    ambPress: null,
    stv: null,
    noxRange: null,
    aveTime: null,
    noBkg: null,
    noxBkg: null,
    noCoef: null,
    no2Coef: null,
    noxCoef: null,
  });
  
  const selectItems = [
    ['projectName', '项目名称'],
    ['method', '分析方法'],
    ['instrumentName', '仪器名称及型号'],
    ['assetNumber', '固定资产登记号'],
  ];

  const inputItems = [
    ['balanceFlow', '平衡气流'],
    ['ambTemp', '室温'],
    ['ambRh', '相对湿度'],
    ['ambPress', '大气压'],
    ['stv', 'STV'],
  ];

  const noxItems = [
    ['noxRange', '量程', '量程 (PPM)'],
    ['aveTime', '平均时间', ' (Sec)'],
    ['noBkg', 'NO BKG', 'NO BKG (PPM)'],
    ['noxBkg', 'NOx BKG', 'NOx BKG (PPM)'],
    ['noCoef', 'NO Coef', 'NO Coef'],
    ['no2Coef', 'NO2 Coef', 'NO2 Coef'],
    ['noxCoef', 'NOx Coef', 'NOx Coef'],
  ];

  const handleInstData = data => {
    const d = new Date();
    let { nox } = data;
    const newNox = noxItems.map(
      item => ({
        name: item[0],
        label: item[1],
        placeholder: item[2],
        value: nox[item[0]],
      })
    );
    setNoxData(newNox);
    console.log(d.toISOString(), "RawRecordForm new state:", newNox);
  };
  
  const handleFetch = () => {
    if (!start) {
      alert("开始运行才能获取数据");
    } else if (!data) {
      alert("无法获取数据，请检查设备");
    } else {
      handleInstData(data);
    };
  };

  // const onReset = () => {
  //   form.resetFields();
  // };

  const onFinish = (value) => {
    // post(values, url);
    console.log(value);
  };
  

  return (
    <Form
      {...layout}
      form={form}
      name="control-hooks" 
      onFinish={onFinish}
    >
      {
        selectItems.map((item, index)=> {
          <Form.Item key={index} name={item[0]} label={item[1]}>
            <Select
              placeholder={item[1]}
              defaultValue={setting[item[0]][0]}
              initialValue={setting[item[0]][0]}
              value={setting[item[0]][0]}
            >
              {setting[item[0]].map((item, index) => <Option key={index} value={item}>{item}</Option>)}
            </Select>
          </Form.Item>
        })
      }
      
      {/* <Form.Item name="projectName" label="项目名称">
        <Select
          placeholder={"项目名称"}
          // defaultValue={setting['projectName'][0]}
          initialValue={setting['projectName'][0]}
          value={setting['projectName'][0]}
        >
          {setting['projectName'].map((item, index) => <Option key={index} value={item}>{item}</Option>)}
        </Select>
      </Form.Item>

      <Form.Item name="method" label="分析方法">
        <Select
          placeholder={"分析方法"}
          defaultValue={setting['method'][0]}
          value={setting['method'][0]}
        >
          {setting['method'].map((item, index) => <Option key={index} value={item}>{item}</Option>)}
        </Select>
      </Form.Item>

      <Form.Item name="instrumentName" label="仪器名称及型号">
        <Select
          placeholder={"仪器名称及型号"}
          defaultValue={setting['instrumentName'][0]}
          value={setting['instrumentName'][0]}
        >
          {setting['instrumentName'].map((item, index) => <Option key={index} value={item}>{item}</Option>)}
        </Select>
      </Form.Item>
      
      <Form.Item name="assetNumber" label="固定资产登记号">
        <Select 
          placeholder={"固定资产登记号"} 
          defaultValue={setting['assetNumber'][0]}
          value={setting['assetNumber'][0]}
        >
          {setting['assetNumber'].map((item, index) => <Option key={index} value={item}>{item}</Option>)}
        </Select>
      </Form.Item> */}

      {
        inputItems.map((item, index) => {
          <Form.Item key={index} name={item[0]} label={item[1]}>
            <Input placeholder={item[1]} />
          </Form.Item>
        })
      }

      {/* <Form.Item name="balanceFlow" label="平衡气流">
        <Input placeholder="平衡气流 (ml/min)" />
      </Form.Item>

      <Form.Item name="ambTemp" label="室温">
        <Input placeholder="室温 (摄氏度)" />
      </Form.Item>

      <Form.Item name="ambRh" label="相对湿度">
        <Input placeholder="相对湿度 (%)" />
      </Form.Item>

      <Form.Item name="ambPress" label="大气压">
        <Input placeholder="大气压 (Mpa)" />
      </Form.Item>

      <Form.Item name="stv" label="STV">
        <Input placeholder="数据稳定判断值" />
      </Form.Item> */}

      {
        noxData ? 
          noxData.map(item => 
            <Form.Item name={item["name"]} label={item["label"]}>
              <Input 
                placeholder={item["placeholder"]}
                defaultValue={item["value"]}
                // value={item["value"]}
              />
            </Form.Item>
          ) : null
      }

      <Form.Item {...tailLayout}>
        <Button htmlType="button" onClick={handleFetch}>
          获取状态
        </Button>
        {/* <Button htmlType="button" onClick={onReset}>
          重置全部
        </Button> */}
        <Button type="primary" htmlType="submit">
          保存记录
        </Button>
      </Form.Item>
    </Form>
  );
};
