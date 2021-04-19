import React, { Component } from 'react';
import logo from './logo.svg';
import DWTLogo from './icon-dwt.svg';
import DynamsoftLogo from './logo-dynamsoft-white-159X39.svg';
import './App.css';
import DWT from './DynamsoftSDK';

class App extends Component {
  productKey = 't00881wAAAHA/txgTp/vaKgBUztynBN3DxSVf9ZSTJzA9UjKfc/e1/27DqH8/++u4qag2u3MS+GAYBb7bhR4O5XJqWQxEcZttiKx3zh2UAfwNmDwUM9kJ0ncsvA==';
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <a href="https://www.dynamsoft.com/Products/WebTWAIN_Overview.aspx" target="_blank" rel="noopener noreferrer" ><img src={DWTLogo} className="dwt-logo" alt="Dynamic Web TWAIN Logo" /></a>
          <div style={{ width: "10px" }}></div>
          <a href="https://reactjs.org/" target="_blank" rel="noopener noreferrer" ><img src={logo} className="App-logo" alt="logo" /></a>
          <div style={{ width: "770px" }}></div>
          <a href="https://www.dynamsoft.com" target="_blank" rel="noopener noreferrer" ><img src={DynamsoftLogo} className="ds-logo" alt="Dynamsoft Logo" /></a>
        </header>
        <br />
        <DWT
          productKey={this.productKey}
          features={[
            "scan",
            "camera",
            "load",
            "save",
            "upload",
            "barcode",
            "ocr",
            "uploader"
          ]}
        />
      </div>
    );
  }
}

export default App;
