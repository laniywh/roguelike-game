import React, { Component } from 'react';
import { connect } from 'react-redux';
import { WEAPONS } from '../reducers';
import { toggleDarkness } from '../actions';

class Stats extends Component {
  render() {
    const { level, dungeon, health, xp, xpNeeded, weaponId, attack, toggleDarkness } = this.props;
    return (
      <ul className="stats">
        <li>Level: {level}</li>
        <li>Health: {health}</li>
        <li>XP: {xp}</li>
        <li>Next Level: {xpNeeded} XP</li>
        <li>Weapon: {WEAPONS[weaponId].name}</li>
        <li>Attack: {attack}</li>
        <li>Dungeon: {dungeon}</li>
        <li><button onClick={toggleDarkness}>Toggle Darkness</button></li>
      </ul>
    );

  }
}

const mapStateToProps = state => {
  return {
    dungeon: state.dungeon,
    health: state.player.health,
    level: state.player.level,
    weaponId: state.player.weaponId,
    attack: state.player.attack,
    xp: state.player.xp,
    xpNeeded: state.player.xpNeeded,
  }
}

export default connect(mapStateToProps, {toggleDarkness})(Stats);