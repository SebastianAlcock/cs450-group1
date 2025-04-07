import { Component } from 'react';

import './Styles/Visualization3.css';

class Visualization3 extends Component {
  componentDidMount() {
    this.createVisualization(this.props.data);
  };

  componentDidUpdate() {
    this.createVisualization(this.props.data);
  };

  createVisualization = (data) => {
    console.log(data)
  }
  
  render() {
    return (
      <div className='Visualization3'>
        Visualization3
      </div>
    );
  }
}

export default Visualization3;
