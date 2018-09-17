const validator = require('validator');
const config = require('./../utils/config');
const messageModel = require('../models/MessageModel');

let validationError = {
  name:'ValidationError',
  errors:{}
};


/*******************
 *  Save
 *  param: lng, lat, nickname, contents
 *  TODO 에러 코드 정리 및 PUSH
 ********************/
exports.save = async (req, res, next) => {
  /* PARAM */
  const nickname = req.body.nickname || req.params.nickname;
  const lng = req.body.lng || req.params.lng;
  const lat = req.body.lat || req.params.lat;
  const contents = req.body.contents || req.params.contents;
  
  /* 2. 유효성 체크하기 */
  let isValid = true;

  if (!nickname || nickname === undefined || nickname === '') {
    isValid = false;
    validationError.errors.nickname = { message : "Nickname is required" };
  }

  if (!lng || lng === undefined || lng === '') {
    isValid = false;
    validationError.errors.lng = { message : "Longitude is required" };
  }

  if (!lat || lat === undefined || lat === '') {
    isValid = false;
    validationError.errors.lat = { message : "Latitude is required" };
  }

  if (!contents || contents === null || contents === undefined) {
    isValid = false;
    validationError.errors.contents = { message : "Contents is required" };
  }      

  if (!isValid) return res.status(400).json(validationError);
  /* 유효성 체크 끝 */

  let result = '';

  const messageData = {
    nickname, lng, lat, contents
  };    
    
  try {
    result = await messageModel.save(messageData); 
  } catch (err) {
    // TODO 에러 잡았을때 응답메세지, 응답코드 수정할것
    reject(err);
  } finally {
    response = {
      status: 201,
      message: "Save Message Successfully",
      result
    };
    
    return res.status(201).json(response);
  }    
};



/*******************
 *  selectOne
 *  param : idx
 ********************/
exports.selectOne = async (req, res, next) => {
  /* PARAM */
  const idx = req.body.idx || req.params.idx;

  /* 1. 유효성 체크하기 */
  let isValid = true;

  if (!idx || validator.isEmpty(idx)) {
    isValid = false;
    validationError.errors.idx = { message : "idx is required" };
  }

  if (!isValid) return res.status(400).json(validationError); 
  /* 유효성 체크 끝 */

  // 2. DB에서 끌고 오기
  let result = '';
  try {
    result = await messageModel.selectOne(idx);
  } catch (error) {
    // TODO 에러 잡았을때 응답메세지, 응답코드 수정할것
    return next(error);
  }

  if (result.length > 0) {
    const response = {
      status: 200,
      message : "Select Messages Successfully",
      result: result
    };
    return res.status(200).json(response);
  } else {
    const response = {
      status: 400,
      message : "Message with index does not exist."
    };
    return res.status(400).json(response);
  }

}



/*******************
 *  selectAll
 *  @param: page
 ********************/
exports.selectAll = async (req, res, next) => {
  /* PARAM */
  const palaceIdx = req.body.idx || req.params.idx;
  const page = req.body.page || req.params.page;
  
  // 2. DB에서 끌고 오기
  let result = '';
  try {
    result = await messageModel.selectAll(palaceIdx, page);
  } catch (err) {
    // TODO 에러 잡았을때 응답메세지, 응답코드 수정할것
    return next(err);
  } finally {
    const respond = {
      status: 200,
      message : "Select Messages Successfully",
      result: result
    };
    return res.status(200).json(respond);
  } 
}


/*******************
 *  selectCircle
 *  @param: lng, lat, radius, page
 ********************/
exports.selectCircle = async (req, res, next) => {
  /* PARAM */
  const lng = req.body.lng || req.params.lng;
  const lat = req.body.lat || req.params.lat;
  const page = req.body.page || req.params.page;  
  const radius = config.radius;

  /* 1. 유효성 체크하기 */
  let isValid = true;

  if (!lng || lng === '' || lng === undefined) {
    isValid = false;
    validationError.errors.lng = { message : "Longitude is required" };
  }

  if (!lat || lat === '' || lat === undefined) {
    isValid = false;
    validationError.errors.lat = { message : "Latitude is required" };
  }

  if (!isValid) return res.status(400).json(validationError);

  let result = '';
  try {
    const conditions = {
      lng, lat, radius
    };

    result = await messageModel.selectCircle(conditions, page);
  } catch (err) {
    console.log(err);
  } finally {
    const respond = {
      status: 200,
      message : "Select Messages Successfully",
      result
    };
    return res.status(200).json(respond);
  }  
};



/*******************
 *  like
 *  @param: idx
 ********************/
exports.like = async (req, res, next) => {
  // 1. 먼저 해당 jwt가 유효한지 확인 
 
  const idx = req.body.idx || req.params.idx;
  
  /* 1. 유효성 체크하기 */
  let isValid = true;

  if (idx === null || idx === undefined) {
    isValid = false;
    validationError.errors.idx = { message : "Message idx is required" };
  }

  if (!isValid) return res.status(400).json(validationError);
  /* 유효성 체크 끝 */

  // 2. DB에 저장하기
  let result = '';
  try {
    result = await messageModel.like(idx);
  } catch (err) {
    console.log(err);    
  } finally {
    const respond = {
      status: 201,
      message : "Like Messages Successfully",
      result
    };
    return res.status(201).json(respond);
  }
};