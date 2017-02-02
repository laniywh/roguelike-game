export const CREATE_MAP = 'CREATE_MAP';
export const GENERATE_ENEMIES = 'GENERATE_ENEMIES';
export const HANDLE_MOVE = 'HANDLE_MOVE';

export function createMap() {
  return {
    type: CREATE_MAP
  }
}

export function generateEnemies() {
  return {
    type: GENERATE_ENEMIES
  }
}

export function handleMove(keyCode) {
  return {
    type: HANDLE_MOVE,
    payload: keyCode
  }
}