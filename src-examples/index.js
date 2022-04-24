import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import CheckChildren from './CheckChildren';
class Page extends Component {

  render(){
      return <CheckChildren />
  }
}

ReactDOM.render(<Page />, document.getElementById('page'));
