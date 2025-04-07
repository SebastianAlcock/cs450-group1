import React, { Component } from 'react';

import './Styles/App.css';

import Visualization1 from './Visualization1.js';
import Visualization2 from './Visualization2.js';
import Visualization3 from './Visualization3.js';

import * as d3 from "d3";
import file from './sleep.csv';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data:[]
    }
  }

  componentDidMount() {
    let arr = []
    d3.csv(file, (file_data) => {
      arr.push(file_data);
      this.setState({data:arr});
    });
  }

  render() {
    return (
      <div className="App">
        <Visualization1
          data={this.state.data}
        />
        <Visualization2
          data={this.state.data}
        />
        <Visualization3
          data={this.state.data}
        />
      </div>
    );
  }
}

export default App;
