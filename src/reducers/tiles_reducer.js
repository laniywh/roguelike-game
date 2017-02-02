import { CREATE_MAP, GENERATE_ENEMIES, HANDLE_MOVE } from '../actions/index';
import { INITIAL_STATE } from './index';
import _ from 'lodash';
import config from '../config.json';


function initTiles(width, height) {
  let tiles = [];

  for(let i = 0; i < height; i++) {
    tiles[i] = [];
    for(let j = 0; j < width; j++) {
      tiles[i][j] = config.wall;
    }
  }

  return tiles;
}

function createMap(state) {
  let newTiles = initTiles(config.width, config.height);

  let rooms = [];
  let room;

  // Generate rooms
  for(let i = 0; i < config.rooms; i++) {
    // console.log(rooms);
    room = createRoom(rooms);
    room = squashRoom(room, rooms);
    rooms.push(room);

    // place room on map
    for(let i = room.y; i < room.y + room.height; i++) {
      for(let j = room.x; j < room.x + room.width; j++) {
        // console.log('mark: ', i, j);
        newTiles[i][j] = config.room;
      }
    }

    // place exit of current room
    if(room.exit) {
      newTiles[room.exit.y][room.exit.x] = config.room;
    }
  }

  // Generate items
  const enemies = generateItems(newTiles, 'enemy');
  const healths = generateItems(newTiles, 'health');
  const portals = generateItems(newTiles, 'portal');
  const weapons = generateItems(newTiles, 'weapon');

  enemies.forEach(item => {
    newTiles[item.y][item.x] = config.entities.enemy.tile;
  });

  healths.forEach(item => {
    newTiles[item.y][item.x] = config.entities.health.tile;
  });

  portals.forEach(item => {
    newTiles[item.y][item.x] = config.entities.portal.tile;
  });

  weapons.forEach(item => {
    newTiles[item.y][item.x] = config.entities.weapon.tile;
  });

  // Generate player
  const player = createItem(newTiles);
  // console.log('player');
  // console.log(player);
  newTiles[player.y][player.x] = config.entities.player.tile;



  // console.log(newTiles);

  return { tiles: newTiles, player };
}

function squashRoom(room, rooms) {
  // console.log('squashRoom');
  if(rooms.length < 1) return room;

  const closestRoom = findClosestRoom(room, rooms);
  // console.log('closestRoom');
  // console.log(closestRoom);

  let movedRoom = {...room};
  movedRoom.exit = {};


  if(isSameRow(closestRoom, room)) {
    if(room.x > closestRoom.x) {
      movedRoom.x = closestRoom.x + closestRoom.width + 1;
      movedRoom.exit.x = movedRoom.x - 1;
    } else {
      movedRoom.x = closestRoom.x - room.width - 1;
      movedRoom.exit.x = closestRoom.x - 1;
    }
    movedRoom.exit.y = connect(movedRoom.y, movedRoom.height, closestRoom.y, closestRoom.height);

  } else if(isSameCol(closestRoom, room)) {
    if(room.y > closestRoom.y) {
      movedRoom.y = closestRoom.y + closestRoom.height + 1;
      movedRoom.exit.y = movedRoom.y - 1;
    } else {
      movedRoom.y = closestRoom.y - room.height - 1;
      movedRoom.exit.y = closestRoom.y - 1;
    }
    movedRoom.exit.x = connect(movedRoom.x, movedRoom.width, closestRoom.x, closestRoom.width);

  } else {
    if(room.y < closestRoom.y) {
      movedRoom.y = closestRoom.y - room.height - 1;
      movedRoom.exit.y = closestRoom.y - 1;
    } else {
      movedRoom.y = closestRoom.y + closestRoom.height + 1;
      movedRoom.exit.y = movedRoom.y - 1;
    }
    movedRoom.x = closestRoom.x;
    movedRoom.exit.x = connect(movedRoom.x, movedRoom.width, closestRoom.x, closestRoom.width);
  }

  // console.log('movedRoom');
  // console.log(movedRoom);
  return movedRoom;
}

// Choose a random connection between two sides
function connect(aX, aWidth, bX, bWidth) {
  let exit;

  if(aX - bX <= 0) {
    exit = _.random(bX, Math.min(bX + bWidth - 1, aX + aWidth - 1));
  } else {
    exit = _.random(aX, Math.min(aX + aWidth - 1, bX + bWidth - 1));
  }

  return exit
}

function isSameRow(a, b) {
  if(a.y + a.height <= b.y || a.y >= b.y + b.height) return false;
  return true;
}

function isSameCol(a, b) {
  if(a.x + a.width <= b.x || a.x >= b.x + b.width) return false;
  return true;
}


function findClosestRoom(room, rooms) {
  // console.log('findClosestRoom');
  let shortestDistance = 999;
  let closestRoom = null;

  for(let i = 0; i < rooms.length; i++) {
    const currRoom = rooms[i];
    // console.log('currRoom');
    // console.log(currRoom);

    const distance = Math.abs(room.x - currRoom.x) + Math.abs(room.y - currRoom.y);
    if(distance < shortestDistance) {
      shortestDistance = distance;
      closestRoom = currRoom;
    }
  }
  return closestRoom;
}

function createRoom(rooms) {
  // console.log('createRoom');
  let room = {};

  do {
    room.width = _.random(config.minRoomWidth, config.maxRoomWidth);
    room.height = _.random(config.minRoomWidth, config.maxRoomWidth);
    room.x = _.random(config.width - room.width - 1);
    room.y = _.random(config.height - room.height - 1);
  }
  while (doesCollide(rooms, room));
  // console.log(room);

  return room;
}

function doesCollide(rooms, room) {
  for(let i = 0; i < rooms.length; i++) {
    if(!(rooms[i].x + rooms[i].width < room.x || rooms[i].x > room.x + room.width || rooms[i].y + rooms[i].height < room.y || rooms[i].y > room.y + room.height)) {
      return true;
    }
  }

  return false;
}

function generateItems(tiles, item) {
  // console.log('generateItems');

  let items = [];

  for(let i = 0; i < config.entities[item].num; i++) {
    // console.log('createItem');
    items.push(createItem(tiles));
  }

  // console.log(items);

  return items;
}

function createItem(tiles) {
  let x, y;

  do {
    x = _.random(config.width - 1);
    y = _.random(config.height - 1);
  } while(tiles[y][x] !== config.entities.room.tile);

  // console.log(x,y);

  return {x, y};
}

function handleMove(state, action) {
  const player = state.player;
  let tiles = state.tiles;
  let newPlayer, newLocation;

  switch(action.payload) {
    case 'ArrowLeft':
      newLocation = {x: player.x - 1, y: player.y};
      break;

    case 'ArrowRight':
      newLocation = {x: player.x + 1, y: player.y};
      break;

    case 'ArrowUp':
      newLocation = {x: player.x, y: player.y - 1};
      break;

    case 'ArrowDown':
      newLocation = {x: player.x, y: player.y + 1};
      break;

    default:
      return state;
  }

  if(isWall(tiles, newLocation)) return state;

  let newTiles = tiles;
  newTiles[player.y][player.x] = config.entities.room.tile;
  newTiles[newLocation.y][newLocation.x] = config.entities.player.tile;
  newPlayer = { x: newLocation.x, y: newLocation.y};

  return {tiles: newTiles, player: newPlayer};
}


function isWall(tiles, location) {
  return tiles[location.y][location.x] === config.entities.wall.tile;
}

function isRoom(tiles, location) {
  return tiles[location.y][location.x] === config.entities.room.tile;
}

function isEnemy(tiles, location) {
  return tiles[location.y][location.x] === config.entities.enemy.tile;
}

function isHealth(tiles, location) {
  return tiles[location.y][location.x] === config.entities.health.tile;
}

export default function(state = INITIAL_STATE.map, action) {
  switch(action.type) {
    case CREATE_MAP: return createMap(state);
    // case GENERATE_ENEMIES: return generateEnemies(state);
    case HANDLE_MOVE: return handleMove(state, action);

  }
  return state;
}