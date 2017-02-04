import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createMap, generateEnemies } from '../actions/index';
import Tile from '../components/tile';

class Map extends Component {
  componentDidMount() {
    console.log('createMap');
    this.props.createMap();
  }

  renderTiles() {
    // console.log(this.props);
    if(this.props.tiles.length === 0) return;

    const { player, tiles, occupied } = this.props;

    let rows = [];

    for(let i = 0; i < tiles.length; i++) {
      const row = tiles[i].map((tile, j) => {
        if(occupied[`${j}x${i}`]) {
          tile = occupied[`${j}x${i}`];
        }
        return <Tile key={`${j}x${i}`} tile={tile} />;
      });
      rows.push(<div key={i} className="flex-row">{row}</div>);
    }

    return rows;
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

function mapStateToProps({ tiles, player, occupied }) {
  return { tiles, player, occupied };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ createMap, generateEnemies }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);
