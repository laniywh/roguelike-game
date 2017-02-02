import React, { Component } from 'react';
import { connect } from 'react-redux';
import Map from './map';
import { handleMove } from '../actions/index';

class App extends Component {
  componentDidMount() {
    document.addEventListener('keydown', this.onKeydown.bind(this));
  }

  onKeydown(event) {
    event.preventDefault();
    this.props.handleMove(event.key);
  }

  render() {
    return (
      <div>
        <div>React Roguelike Dungeon Game</div>
        <Map />
      </div>
    );
  }
}

export default connect(null, {handleMove})(App);