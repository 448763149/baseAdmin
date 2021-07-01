/*
 * @Description: 
 * @Version: 1.0
 * @Autor: HuQiang
 * @Date: 2021-05-25 14:05:40
 * @LastEditors: HuQiang
 * @LastEditTime: 2021-06-28 16:18:26
 * @detail: 
 * @change: 
 */
'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userName: DataTypes.STRING,
    password: DataTypes.STRING,
    uuid: DataTypes.STRING
  }, {});
  return User;
};
