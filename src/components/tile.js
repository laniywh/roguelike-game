import React from 'react';
import classNames from 'classnames';
import config from '../config.json';

export default ({tile}) => {
  return (
    <div
      className={classNames('tile',
                           {'room': tile === config.room},
                           {'wall': tile === config.wall})}>
    </div>);
}