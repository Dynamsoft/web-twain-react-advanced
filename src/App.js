import React, { Component } from 'react';
import logo from './logo.svg';
import DWTLogo from './icon-dwt.svg';
import DynamsoftLogo from './logo-dynamsoft-white-159X39.svg';
import './App.css';
import DWT from './DynamsoftSDK';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={DWTLogo} className="dwt-logo" alt="Dynamic Web TWAIN Logo" />
          <div style={{ width: "10px" }}></div>
          <img src={logo} className="App-logo" alt="logo" />
          <div style={{ width: "770px" }}></div>
          <img src={DynamsoftLogo} className="ds-logo" alt="Dynamsoft Logo" />
        </header>
        <br />
        <DWT />
      </div>
    );
  }
}

export default App;
