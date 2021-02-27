import React, { useState, useEffect } from 'react';

import Button from 'antd/lib/button';
import Form from 'antd/lib/form'
import Input from  'antd/lib/input'

import useInterval from '../hooks/useInterval'


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
  const url = `http://${hostname}/mock/`

  // clean up before unload page
  window.onunload = () => {
    navigator.sendBeacon(url, JSON.stringify({ mock: 'off' }));
  };

  // post mock data to backend
  const postMock = (data) => {
    const d = new Date();
    console.log(d.toISOString(), 'MockPanel post data:', data);
    fetch(url, {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-Type': 'application/json; charset=UTF-8',
        // 'X-CSRFToken': csrftoken
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then((res) => console.log(d.toISOString(), 'MockPanel post response:', res))
      .catch(console.error);
  };

  useInterval( ()=> {
    const data = {
      mock: 'on',
      power: parseInt(power),
      no: parseInt(no),
      nox: parseInt(nox),
      mfcSet: parseInt(mfcSet),
      mfcRead: parseInt(mfcRead),
    };
    postMock(data)
  }, mock ? delay : null)

  const closeMock = () => {
    setMock(false);
    postMock({mock: 'off'});
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
