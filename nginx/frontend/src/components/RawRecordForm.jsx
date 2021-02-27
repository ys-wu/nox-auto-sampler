import React from 'react';
import { Form, Input, Button, Select } from 'antd';
const { Option } = Select;

export default function RawRecordForm({ setting }) {
  const layout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 12,
    },
  };
  const tailLayout = {
    wrapperCol: {
      offset: 6,
      span: 16,
    },
  };
  const [form] = Form.useForm();

  const onChangeProjectName = (value) => {
    return;
  };

  const onFinish = (values) => {
    console.log(values);
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
      <Form.Item name="projectName" label="项目名称">
        <Select placeholder={"项目名称"} defaultValue={setting['projectName'][0]}>
          {setting['projectName'].map((item, index) => <Option key={index} value={item}>{item}</Option>)}
        </Select>
      </Form.Item>

      <Form.Item name="method" label="分析方法">
        <Select placeholder={"分析方法"} defaultValue={setting['method'][0]}>
          {setting['method'].map((item, index) => <Option key={index} value={item}>{item}</Option>)}
        </Select>
      </Form.Item>

      <Form.Item name="instrumentName" label="仪器名称及型号">
        <Select placeholder={"仪器名称及型号"} defaultValue={setting['instrumentName'][0]}>
          {setting['instrumentName'].map((item, index) => <Option key={index} value={item}>{item}</Option>)}
        </Select>
      </Form.Item>
      
      <Form.Item name="assetNumber" label="固定资产登记号">
        <Select 
          placeholder={"固定资产登记号"} 
          defaultValue={setting['assetNumber'][0]}
        >
          {setting['assetNumber'].map((item, index) => <Option key={index} value={item}>{item}</Option>)}
        </Select>
      </Form.Item>

      <Form.Item name="balanceFlow" label="平衡气流">
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
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          开始分析
        </Button>
        <Button htmlType="button" onClick={onReset}>
          全部重置
        </Button>
      </Form.Item>
    </Form>
  );
};
