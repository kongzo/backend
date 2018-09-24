const mongo = global.utils.mongo;

const helpers = require('../utils/helpers');

/*******************
 *  Save
 *  @param: messageData = { nickname, lat, lon, contents, layout }
 ********************/
exports.save = (messageData) => {
  // 1. model 생성하기
  return new Promise((resolve, reject) => {      
    const message = mongo.messageModel(
      {
        nickname: messageData.nickname,
        location: {
          type: "Point",
          coordinates: [messageData.lng, messageData.lat]
        },
        contents: messageData.contents,
        layout: messageData.layout,
        created_at: helpers.getCurrentDate()
      }
    );

    // 3. save로 저장
    message.save((err, result) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });  
};


/*******************
 *  SelectOne
 *  @param: idx
 ********************/
exports.selectOne = (idx) => {
  return new Promise((resolve, reject) => {      
    // DB의 모델에서 바로 끌고 오면 된다.
    mongo.messageModel.selectOne(idx, (err, result) => {
        if (err) {
          const customErr = new Error("Error occrred while selecting All Messages: " + err);
          reject(customErr);        
        } else {
          resolve(result);
        }
    });
  });
};


/*******************
 *  SelectAll
 *  @param: page
 ********************/
exports.selectAll = (blocks, page) => {
  return new Promise((resolve, reject) => { 
    // DB의 모델에서 바로 끌고 오면 된다.
    mongo.messageModel.selectAll(page, (err, result) => {
        if (err) {
          const customErr = new Error("Error occrred while selecting All Messages: " + err);
          reject(customErr);        
        } else {
          resolve(result);
        }
    });
  });
};


/*******************
 *  SelectCircle
 *  @param: conditions = { lng, lat, radius }, page
 ********************/
exports.selectCircle = (conditions, page) => {
  return new Promise((resolve, reject) => {      
    // DB의 모델에서 바로 끌고 오면 된다.
    mongo.messageModel.selectCircle(conditions, page, (err, result) => {
        if (err) {
          const customErr = new Error("Error occrred while selecting Messages: " + err);
          reject(customErr);        
        } else {
          resolve(result);
        }
    });
  });
};



/*******************
 *  Like
 *  @param: messageIdx
 ********************/
exports.like = (messageIdx) => {
  return new Promise((resolve, reject) => {      
    mongo.messageModel.like(messageIdx, (err, result) => {
      if (err) {
        const customErr = new Error("Error occrred Push likes list: " + err);
        reject(customErr);  
      } else {
        resolve(result);    
      }
    })
  });
};

/*******************
 *  selectComments
 *  @param: messageIdx
 ********************/
exports.selectComments = (messageIdx) => {
  return new Promise((resolve, reject) => {      
    mongo.messageModel.selectComments(messageIdx, (err, result) => {
      if (err) {
        const customErr = new Error("Error occrred Push likes list: " + err);
        reject(customErr);  
      } else {
        resolve(result);    
      }
    })
  });
};

exports.saveComment = (data) => {
  return new Promise((resolve, reject) => {
    const dm = new mongo.commentModel(
      {
        nickname: data.nickname,
        contents: data.contents,
        created_at: helpers.getCurrentDate()
      }
    );
    
    mongo.messageModel.saveComment(data.idx, dm, (err, result) => {
      if (err) {
        const customErr = new Error("Error occrred while Save Direct Message: " + err);
        reject(customErr);        
      } else {
        resolve(result);
      }
    });
  });
}