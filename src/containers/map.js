import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createMap } from '../actions/index';
import config from '../config.json';
import Tile from '../components/tile';

class Map extends Component {
  componentDidMount() {
    console.log('createMap');
    this.props.createMap();
  }

  renderTiles() {
    if(this.props.tiles.length === 0) return;
    // console.log(this.props.tiles);

    let rows = [];

    for(let i = 0; i < config.height; i++) {
      const row = this.props.tiles[i].map((tile, j) => {
        return <Tile key={`${i}${j}`} tile={tile} />;
      });
      rows.push(<div key={i} className="flex-row">{row}</div>);
    }

    return rows;
  }

  render() {
    console.log('render map');
    return (
      <div
        className="map">
        {this.renderTiles()}
      </div>
    );
  }
}

function mapStateToProps({ tiles }) {
  return { tiles };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ createMap }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);
