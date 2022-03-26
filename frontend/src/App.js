import logo from './algorand-algo-logo.png';
import './App.css';
import { Button, Image, Form } from 'semantic-ui-react'
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <br/> 
        <a
          className="App-link"
          href="https://www.algorand.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
        Algorand Blockchain
        </a>
      </header>
<br/>
<br/>
      <Form className = "form">
      <Form.Field>
      <label>NOTE:</label><br/>
      <input placeholder='note' />
    </Form.Field>
    <Form.Field>
      <label>ADDRESS:</label><br/>
      <input placeholder='Address' />
    </Form.Field>
    <Form.Field>
      <label>DECIMALS:</label><br/>
      <input placeholder='decimals' />
    </Form.Field>
    <Form.Field>
      <label>TOTAL ISSUANCE:</label><br/>
      <input placeholder='totalIssuance' />
    </Form.Field>
    <Form.Field>
      <label>UNIT NAME:</label><br/>
      <input placeholder='unitName' />
    </Form.Field>
    <Form.Field>
      <label>ASSET NAME:</label><br/>
      <input placeholder='assetName' />
    </Form.Field>
    <Form.Field>
      <label>ASSET URL:</label><br/>
      <input placeholder='assetURL' />
    </Form.Field>
    <Form.Field>
      <label>ASSET METADATA HASH:</label><br/>
      <input placeholder='assetMetadataHash' />
    </Form.Field>
    <br/>
    <Button type='submit'>Submit</Button>

    <Image  className = "img" src='https://gateway.pinata.cloud/ipfs/QmWqdd26tqzVp7BCUUbAieDccNd5a59s7d3wixYnEva6qe' size='small' wrapped />
    </Form>

    

      
    </div>

  

  
  );
}

export default App;
