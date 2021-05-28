import React, {Component } from 'react';
import './App.css';
import Page from './components/Page/Page';

class App extends Component {

  constructor() {
    super();
    this.state = {
      page: "home"
    };
  }

  pageChange = (page) => {
    this.setState({page: page});
  }

  render() {
    const { page } = this.state;

    return (
      <div>
        <div className="App">
          <Page page = {page} pageChange={this.pageChange}/>
          </div>
      </div>
    );
  }
}

export default App;