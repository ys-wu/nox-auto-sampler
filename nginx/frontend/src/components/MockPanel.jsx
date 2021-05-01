import React, { useState } from 'react';

import Button from 'antd/lib/button';
import Form from 'antd/lib/form'
import Input from  'antd/lib/input'

import useInterval from '../hooks/useInterval'

import post from '../helpers/apiPost';


export default function MockPanel({ quitMock=f=>f }) {

  const [mock, setMock] = useState(true);

  const [power, setPower] = useState(1);
  const [no, setNo] = useState(0);
  const [nox, setNox] = useState(0);
  const [mfcSet, setMfcSet] = useState(0);
  const [mfcRead, setMfcRead] = useState(0);

  // mock data interval in (ms)
  const delay = 1000;

  const hostname = window.location.hostname;
  const port = window.location.port;
  const url = `http://${hostname}:${port}/mock/`;

  // clean up before unload page
  window.onunload = () => {
    navigator.sendBeacon(url, JSON.stringify({ mock: 'off' }));
  };

  useInterval( ()=> {
    const data = {
      mock: 'on',
      power: parseInt(power),
      no: parseFloat(no),
      nox: parseFloat(nox),
      mfcSet: parseFloat(mfcSet),
      mfcRead: parseFloat(mfcRead),
    };
    post(data, url)
  }, mock ? delay : null)

  const closeMock = () => {
    setMock(false);
    post({mock: 'off'}, url);
    quitMock();
  };

  return <>
    <Form layout="inline">
      <Form.Item name="power" label="Power">
        <Input defaultValue={1} onPressEnter={(e => setPower(e.target.value))} />
      </Form.Item>
      <Form.Item name="no" label="NO">
        <Input defaultValue={0} onPressEnter={(e => setNo(e.target.value))} />
      </Form.Item>
      <Form.Item name="nox" label="NOx">
        <Input defaultValue={0} onPressEnter={(e => setNox(e.target.value))} />
      </Form.Item>
      <Form.Item name="mfcRead" label="MFC Read">
        <Input defaultValue={0} onPressEnter={(e => setMfcRead(e.target.value))} />
      </Form.Item>
      <Button onClick={closeMock}>Close</Button>
      <p>Press 'Enter' to update</p>
    </Form>
  </>
};
