import { Component } from 'react';

import './Styles/Visualization1.css';

class Visualization1 extends Component {
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
      <div className='Visualization1'>
        Visualization1
      </div>
    );
  }
}

export default Visualization1;
