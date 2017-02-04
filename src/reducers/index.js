import { CREATE_MAP, GENERATE_ENEMIES, HANDLE_MOVE } from '../actions/index';
import _ from 'lodash';

const WIDTH = 50;
const HEIGHT = 40;
const ROOMS = 9;
const MAX_ROOM_WIDTH = 12;
const MIN_ROOM_WIDTH = 6;
const HEALTH_INCREASE = 30;
const ENEMIES = 10;
const DUNGEONS = 3;
const XP_NEEDED_BASED = 50;
const XP_INCREASE_MULTIPLE = 2;
const ATK_LVL_INCREASE_MULTIPLE = 4;

const ITEMS = {
  health: {
    num: 5,
  },
  portal: {
    num: 1,
  },
  weapon: {
    num: 1,
  },
};

export const WEAPONS = {
  0: {
    name: 'Fist',
    attack: 10
  },
  1: {
    name: 'Axe',
    attack: 30
  },
  2: {
    name: 'Hand Gun',
    attack: 50
  },
  3: {
    name: 'AK47',
    attack: 100
  }
}

const ENEMY_TYPES = {
  1: {
    health: 20,
    attack: 20,
    xp: 10
  },
  2: {
    health: 60,
    attack: 30,
    xp: 20
  },
  3: {
    health: 100,
    attack: 40,
    xp: 30
  }
};

const INITIAL_STATE = {
  tiles: [],
  player: {
    x: null,
    y: null,
    health: 100,
    attack: WEAPONS[0].attack + ATK_LVL_INCREASE_MULTIPLE,
    level: 1,
    xp: 0,
    xpNeeded: XP_NEEDED_BASED,
    weaponId: 0,
  },
  dungeon: 0,
  occupied: {},
  enemies: {}
};

function xpNeeded(level) {
  return XP_NEEDED_BASED * level;
}

function allWall(tiles) {
  let newTiles = [];

  for(let i = 0; i < HEIGHT; i++) {
    newTiles[i] = [];
    for(let j = 0; j < WIDTH; j++) {
      // if(!tiles[i] || tiles[i][j] !== 'wall') {
        newTiles[i][j] = 'wall';
      // }
    }
  }

  return newTiles;
}

function createMap(state) {
  console.log('createMap');

  let newTiles = allWall(state.tiles);
  const newDungeon = state.dungeon + 1;

  let rooms = [];
  let room;

  // Generate rooms
  for(let i = 0; i < ROOMS; i++) {
    // console.log(rooms);
    room = createRoom(rooms);
    room = squashRoom(room, rooms);
    rooms.push(room);

    // place room on map
    for(let i = room.y; i < room.y + room.height; i++) {
      for(let j = room.x; j < room.x + room.width; j++) {
        // console.log('mark: ', i, j);
        newTiles[i][j] = 'floor';
      }
    }

    // place exit of current room
    if(room.exit) {
      newTiles[room.exit.y][room.exit.x] = 'floor';
    }
  }

  // console.log(newTiles);

  // Place all types of items
  let occupied = createItems(newTiles, newDungeon);

  // Place some enemies
  let enemies = {};

  for(let i = 0; i < ENEMIES; i++) {
    const cell = getRandomEmptyCell(newTiles, occupied);
    occupied[`${cell.x}x${cell.y}`] = 'enemy';
    enemies[`${cell.x}x${cell.y}`] = { health: ENEMY_TYPES[newDungeon].health };
  }

  // Place player
  const player = createPlayer(state.player, newTiles, occupied);
  occupied[`${player.x}x${player.y}`] = 'player';

  // console.log(occupied);


  return {
    ...state,
    tiles: newTiles,
    occupied,
    player,
    dungeon: newDungeon,
    enemies
  };
}


function createItems(tiles, dungeon) {
  let occupied = {};
  // console.log(dungeon);

  Object.keys(ITEMS).map(itemName => {
    if(dungeon === DUNGEONS && itemName === 'portal') return;

    for(let i = 0; i < ITEMS[itemName].num; i++) {
      const cell = getRandomEmptyCell(tiles, occupied);
      occupied[`${cell.x}x${cell.y}`] = itemName;
    }
  });

  return occupied;
}

function createPlayer(player, tiles, occupied) {
  const cell = getRandomEmptyCell(tiles, occupied);

  return {
    ...player,
    x: cell.x,
    y: cell.y,
  }
}

function getRandomEmptyCell(tiles, occupied) {
  let x, y;

// console.log('getRandomEmptyCell');

// console.log(tiles);
  do {
    x = _.random(WIDTH - 1);
    y = _.random(HEIGHT - 1);
  } while(!isEmptyCell(x, y, tiles, occupied));

  return { x, y }
}

function isEmptyCell(x, y, tiles, occupied) {
  // console.log('occupied');
  // console.log(occupied);

  const currTile = tiles[y][x];
  const currOccupied = occupied[x + 'x' + y];

  // console.log(`${x}x${y}`, occupied[x + 'x' + y]);

  return currTile !== 'wall' && !currOccupied;
}

function squashRoom(room, rooms) {
  // console.log('squashRoom');
  // console.log(room);
  if(rooms.length < 1) return room;

  const closestRoom = findClosestRoom(room, rooms);
  // console.log('closestRoom');
  // console.log(closestRoom);

  let movedRoom = {...room};
  movedRoom.exit = {};


  if(isSameRow(closestRoom, room)) {
    // console.log('isSameRow');

    if(room.x > closestRoom.x) {
      movedRoom.x = closestRoom.x + closestRoom.width + 1;
      movedRoom.exit.x = movedRoom.x - 1;
    } else {
      movedRoom.x = closestRoom.x - room.width - 1;
      movedRoom.exit.x = closestRoom.x - 1;
    }
    movedRoom.exit.y = connect(movedRoom.y, movedRoom.height, closestRoom.y, closestRoom.height);

  } else if(isSameCol(closestRoom, room)) {
    // console.log('isSameCol');

    if(room.y > closestRoom.y) {
      movedRoom.y = closestRoom.y + closestRoom.height + 1;
      movedRoom.exit.y = movedRoom.y - 1;
    } else {
      movedRoom.y = closestRoom.y - room.height - 1;
      movedRoom.exit.y = closestRoom.y - 1;
    }
    movedRoom.exit.x = connect(movedRoom.x, movedRoom.width, closestRoom.x, closestRoom.width);

  } else {
    // console.log('not same row or col');

    if(room.y < closestRoom.y) {
      movedRoom.y = closestRoom.y - room.height;
      if(movedRoom.y > 0) movedRoom.y --;
      movedRoom.exit.y = closestRoom.y - 1;
    } else {
      movedRoom.y = closestRoom.y + closestRoom.height;
      if(movedRoom.y + room.height < HEIGHT - 1) movedRoom.y ++;
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
  console.log('createRoom');
  let room = {};

  do {
    console.log('try');

    room.width = _.random(MIN_ROOM_WIDTH, MAX_ROOM_WIDTH);
    room.height = _.random(MIN_ROOM_WIDTH, MAX_ROOM_WIDTH);
    room.x = _.random(WIDTH - room.width - 1);
    room.y = _.random(HEIGHT - room.height - 1);
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

function handleMove(state, action) {
  if(state.player.health < 1) return state;

  // const player = state.player;
  const { player, player: { x, y, weaponId }, enemies, occupied, dungeon } = state;
  // let newTiles = state.tiles;
  let newPlayer, newLocation, newOccupied, newWeapon, newTiles, newEnemies;
  newEnemies = { ...enemies };
  newPlayer = {...player};
  newOccupied = {...occupied};
  // newWeaponId = weaponId;

  switch(action.payload) {
    case 'ArrowLeft':
      // newLocation = {x: player.x - 1, y: player.y};
      newLocation = {x: x - 1, y };
      // x = player.x - 1;
      break;

    case 'ArrowRight':
      newLocation = {x: x + 1, y};
      break;

    case 'ArrowUp':
      newLocation = {x, y: y - 1};
      break;

    case 'ArrowDown':
      newLocation = {x, y: y + 1};
      break;

    default:
      return state;
  }

  if(isWall(state.tiles, newLocation)) return state;

  // console.log(state.occupied);

  if(isEmptyCell(newLocation.x, newLocation.y, state.tiles, state.occupied)) {
    move();

  } else if(isEntity('enemy', state.occupied, newLocation)) {
    const enemyLocation = `${newLocation.x}x${newLocation.y}`;

    newEnemies[enemyLocation].health -= damage(playerAtk(player));

    // Enemy killed
    if(newEnemies[enemyLocation].health < 1) {
      delete newEnemies[enemyLocation];
      delete newOccupied[enemyLocation];

      // Gain XP
      newPlayer.xp += ENEMY_TYPES[dungeon].xp;
      newPlayer.xpNeeded = xpNeeded(newPlayer.level) - newPlayer.xp;

      // Level up
      if(newPlayer.xpNeeded < 1) {
        newPlayer.level++;
        newPlayer.xpNeeded = xpNeeded(newPlayer.level);
        newPlayer.attack = playerAtk(newPlayer);
      }
    // Enemy still alive
    } else {
      newPlayer.health -= damage(ENEMY_TYPES[dungeon].attack);

      // console.log('enemy health: ', newEnemies[enemyLocation].health);

      // Player killed
      if(newPlayer.health < 1) {
        console.log('game over');

        console.log(newOccupied);
        delete newOccupied[`${player.x}x${player.y}`];
        console.log(newOccupied);
      }

    }



  } else if(isEntity('health', state.occupied, newLocation)) {
    move();

    newPlayer = {...newPlayer, health: newPlayer.health + HEALTH_INCREASE};

  } else if(isEntity('weapon', state.occupied, newLocation)) {
    move();

    // newWeaponId = state.dungeon;
    newPlayer.weaponId = state.dungeon;
    newPlayer.attack = playerAtk(newPlayer);

  } else if(isEntity('portal', state.occupied, newLocation)) {
    return createMap(state);
  }

  function move() {
    newPlayer = {...newPlayer, x: newLocation.x, y: newLocation.y};
    delete newOccupied[`${x}x${y}`];
    newOccupied[`${newPlayer.x}x${newPlayer.y}`] = 'player';
  }

  // console.log(newPlayer);

  return {
    ...state,
    player: newPlayer,
    occupied: newOccupied,
    enemies: newEnemies
  };
}

function playerAtk(player) {
  return WEAPONS[player.weaponId].attack + ATK_LVL_INCREASE_MULTIPLE * player.level;
}

function damage(attack) {
  return _.random(attack / 2, attack);
}


function isWall(tiles, location) {
  return tiles[location.y][location.x] === 'wall';
}

function isEntity(name, occupied, location) {
  return occupied[location.x + 'x' + location.y] === name;
}

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case CREATE_MAP: return createMap(state);
    // case GENERATE_ENEMIES: return generateEnemies(state);
    case HANDLE_MOVE: return handleMove(state, action);
  }
  return state;
}
