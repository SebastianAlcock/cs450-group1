import { Component } from 'react';

import './Styles/Visualization2.css';

class Visualization2 extends Component {
  componentDidMount() {
    this.createVisualization(this.props.data);
  };

  componentDidUpdate() {
    this.createVisualization(this.props.data);
  };

  createVisualization = (data) => {
    //console.log(data)
  }
  
  render() {
    return (
      <div className='Visualization2'>
        Visualization2
      </div>
    );
  }
}

export default Visualization2;
