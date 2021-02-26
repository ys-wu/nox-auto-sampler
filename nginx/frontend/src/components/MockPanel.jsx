import Button from 'antd/lib/button';


export default function MockPanel({ quitMock=f=>f }) {
  
  const onClick = () => {
    quitMock();
  };

  return <>
    <Button onClick={onClick}>Turn off mocking</Button>    
  </>
};
