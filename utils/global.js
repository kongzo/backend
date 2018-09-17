/******************************************************************************
' 파일     : global.js
' 작성     : 박소영
' 목적     : DB나 메시지 큐, logger 등 전역으로 쓰이는 모듈을 모아놓은 파일입니다.
******************************************************************************/

const config = require('../utils/config');

/* mongodb */
const mongoose = require('mongoose');

const url = `mongodb://${process.env.EC2_HOST}:${process.env.MONGO_PORT}/${process.env.DB_NAME}`;

const options = {
  user: process.env.MONGO_USERNAME,
  pass: process.env.MONGO_PASSWORD,
  autoReconnect: true,
  useNewUrlParser: true,
  poolSize: 2,
  keepAlive: 300000,
  connectTimeoutMS: 30000,
  reconnectTries: 300000,
  reconnectInterval: 2000,
  promiseLibrary: global.Promise
};

mongoose.connect(url, options);

const mongo = {};
mongo.db = mongoose.connection;
mongo.db.on('error', console.error);
mongo.db.once('open', function(){
  console.log("[MongoDB] *** New connection established with the MongoDB ...");
  createSchema(config); // utils/config에 등록된 스키마 및 모델 객체 생성
});
mongo.db.on('disconnected', function(){
  console.log("[MongoDB] Connection disconnected with the MongoDB ...");
});

// config에 정의한 스키마 및 모델 객체 생성
function createSchema(config){
  const schemaLen = config.db_schemas.length;

  for (let i = 0; i < schemaLen; i++){
    let curItem = config.db_schemas[i];

    // 모듈 파일에서 모듈을 불러온 후 createSchema() 함수 호출!
    let curSchema = require(curItem.file).createSchema(mongoose);

    // User 모델 정의
    let curModel = mongoose.model(curItem.collection, curSchema);

    // database 객체에 속성으로 추가
    mongo[curItem.schemaName] = curSchema;
    mongo[curItem.modelName] = curModel;
    console.log("[MongoDB] { %s, %s } is added to mongo Object.",
      curItem.schemaName, curItem.modelName);
  }
};

module.exports.mongo = mongo;