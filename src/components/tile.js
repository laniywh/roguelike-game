import React from 'react';
import classNames from 'classnames';
import config from '../config.json';

export default ({tile}) => {
  return (
    <div
      className={classNames('tile',
                           {'room': tile === config.entities.room.tile},
                           {'wall': tile === config.entities.wall.tile},
                           {'enemy': tile === config.entities.enemy.tile},
                           {'health': tile === config.entities.health.tile},
                           {'player': tile === config.entities.player.tile},
                           {'portal': tile === config.entities.portal.tile},
                           {'boss': tile === config.entities.boss.tile},
                           {'weapon': tile === config.entities.weapon.tile})}>
    </div>);
}