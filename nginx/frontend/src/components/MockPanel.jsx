import React, { useState, useEffect } from 'react';
import Button from 'antd/lib/button';
import Form from 'antd/lib/form'
import Input from  'antd/lib/input'


export default function MockPanel({ quitMock=f=>f }) {

  const [power, setPower] = useState(1);
  const [no, setNo] = useState(0);
  const [nox, setNox] = useState(0);
  const [mfcSet, setMfcSet] = useState(0);
  const [mfcRead, setMfcRead] = useState(0);

  var interval;

  useEffect( () => {
    interval = setInterval(() => {
      postState();
    }, 2000)
  }, []);

  const postState = () => {
    const d = new Date();
    const data = {
      power: power,
      no: no,
      nox: nox,
      mfcSet: mfcSet,
      mfcRead: mfcRead,
    };
    console.log(d.toISOString(), 'MockPanle post data:', Date.now(), data);
  };

  const closeMock = () => {
    clearInterval(interval);    // setMock(false);
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
      <Form.Item name="mfcSet" label="MFC Set">
        <Input defaultValue={0} onPressEnter={(e => setMfcSet(e.target.value))} />
      </Form.Item>
      <Form.Item name="mfcRead" label="MFC Read">
        <Input defaultValue={0} onPressEnter={(e => setMfcRead(e.target.value))} />
      </Form.Item>
      <Button onClick={closeMock}>Close</Button>
    </Form>
  </>
};
