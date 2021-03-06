
/*
 * @Description: 
 * @Version: 1.0
 * @Autor: HuQiang
 * @Date: 2021-05-25 11:02:19
 * @LastEditors: HuQiang
 * @LastEditTime: 2021-07-21 16:35:12
 * @detail: 
 * @change: 
 */
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const UUID = require('uuid')
const moment = require('moment');
/* 接口统一返回格式 */
global.setResult = function(data=null,code='0',message='success'){
  return{
    code,
    message:message,
    data:data
  }
}

/**
* 生成32位uuid
* UUID.v1 基于时间戳生成(time based)
* UUID.v4 随机生成(random), 有一定几率重复
*/
global.getUuid = function(){
  let strUUID2 = UUID.v1().replace(/-/g, '');
  return strUUID2
}

/**
* 权限校验
* 根据前端传过的cookieStr去检验当前用户是否存在
*/
global.checkAuth = function(req, res, next) {
  let cookie = headersCookie(req.headers.cookie)
  if(!cookie) res.json(setResult('登录信息失效','51','登录信息失效'))
  let { uid } = verifyToken(cookie)
  if (uid){
    next();
  }else{
    res.json(setResult('登录信息失效','51','登录信息失效'))
  }
}

/**
* 生成token的方法
* 根据私密生成Token
*/
global.getToken = function(data){
  let created = Math.floor(Date.now() / 1000);
  let cert = fs.readFileSync(path.join(__dirname, '../config/rsa_private_key.pem'));//私钥
  let token = jwt.sign({
      data,
      exp: created + 3600 * 24
  }, cert, {algorithm: 'RS256'});
  return token;
}

/**
* 解密Token检验账号密码
*/
global.verifyToken = function(token,back){
  let cert = fs.readFileSync(path.join(__dirname, '../config/rsa_public_key.pem'));//公钥
  let res = null
  try{
      let result = jwt.verify(token, cert, {algorithms: ['RS256']}) || {};
      let {exp = 0} = result,current = Math.floor(Date.now()/1000);
      if(current <= exp){
        res = result.data || {};
      }
  }catch(e){

  }
  return res;
}

/**
* 获取Token
*/
global.headersCookie = function(cookieStr,){
  let Cookies ={};
  if (cookieStr != null) {
    cookieStr.split(';').forEach(l => {
      let parts = l.split('=');
      Cookies[parts[0].trim()] = (parts[1] || '').trim();
    });
  }
  return Cookies['Admin-Token']
}


/**
* 获取时间
*/
global.getTime = function(){
  return moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
}



/**
 * 对象数据深拷贝
 * @param  {Object || Array}     obj     要深拷贝的对象
 * @return {Object || Array}             返回深拷贝后的对象
 */
 global.deepCopy = function (obj) {
  console.log(obj)
	// 如果深拷贝数据不是对象类型则直接返回原数据
	if(obj == null || typeof obj !== "object") return obj;

	var result = Array.isArray(obj) ? [] : {};

	for(var key in obj) {
		// eslint-disable-next-line no-prototype-builtins
		if(obj.hasOwnProperty(key)) {
			result[key] = typeof obj[key] == "object" ? deepCopy(obj[key]) : obj[key];
		}
	}
	return result;
}