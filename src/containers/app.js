import React, { Component } from 'react';
import { connect } from 'react-redux';
import Map from './map';
import Stats from './stats';
import { handleMove } from '../actions/index';

class App extends Component {
  componentDidMount() {
    document.addEventListener('keydown', this.onKeydown.bind(this));
  }

  onKeydown(event) {
    if(event.keyCode > 36 && event.keyCode < 41) {
      event.preventDefault();
      this.props.handleMove(event.key);
    }
  }

  render() {
    return (
      <div>
        <div>React Roguelike Dungeon Game</div>
        <Stats />
        <Map />
      </div>
    );
  }
}

export default connect(null, {handleMove})(App);