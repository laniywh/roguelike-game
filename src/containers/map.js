import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createMap, generateEnemies } from '../actions/index';
import Tile from '../components/tile';

const VISIBLE_RANGE = 6;

class Map extends Component {
  componentDidMount() {
    console.log('createMap');
    this.props.createMap();
  }

  renderTiles() {
    // console.log(this.props);
    if(this.props.tiles.length === 0) return;

    const { player, tiles, occupied, dark } = this.props;

    let rows = [];
    let tile = '';

    for(let y = 0; y < tiles.length; y++) {
      const row = tiles[y].map((tile, x) => {
        if(occupied[`${x}x${y}`]) {
          tile = occupied[`${x}x${y}`];
        }
        if(dark && this.isDarkTile(player, x, y)) {
          tile = 'dark';
        }
        return <Tile key={`${x}x${y}`} tile={tile} />;
      });
      rows.push(<div key={y} className="flex-row">{row}</div>);
    }

    return rows;
  }

  isDarkTile(player, x, y) {
    return x < player.x - VISIBLE_RANGE || x > player.x + VISIBLE_RANGE ||
           y < player.y - VISIBLE_RANGE || y > player.y + VISIBLE_RANGE;
  }

  render() {
    return (
      <div
        className="map">
        {this.renderTiles()}
      </div>
    );
  }
}

function mapStateToProps({ tiles, player, occupied, dark }) {
  return { tiles, player, occupied, dark };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ createMap, generateEnemies }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);
