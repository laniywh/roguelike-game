import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createMap, generateEnemies } from '../actions/index';
import config from '../config.json';
import Tile from '../components/tile';

class Map extends Component {
  componentDidMount() {
    console.log('createMap');
    this.props.createMap();
    // this.props.generateEnemies();
  }

  renderTiles() {
    // console.log(this.props);
    if(this.props.map.tiles.length === 0) return;

    let rows = [];

    for(let i = 0; i < config.height; i++) {
      const row = this.props.map.tiles[i].map((tile, j) => {
        return <Tile key={`${i}${j}`} tile={tile} />;
      });
      rows.push(<div key={i} className="flex-row">{row}</div>);
    }

    return rows;
  }

  onKeyboardDown(event) {
    console.log(event);
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

function mapStateToProps({ map }) {
  return { map };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ createMap, generateEnemies }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);
