import React, { Component } from 'react';
import Map from '../containers/map';

export default class App extends Component {
  render() {
    return (
      <div>
        <div>React Roguelike Dungeon Game</div>
        <Map />
      </div>
    );
  }
}
