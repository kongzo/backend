const mongoose = require('mongoose');

const paginationCount = require('../utils/config').pagination_count;
const commentSchema = global.utils.mongo.commentSchema.obj;

let Schema = {};

Schema.createSchema = (mongoose) => {
  const messageSchema = mongoose.Schema({
    idx: { type: Number, index: { unique: true } },
    nickname: { type: String, required: true },
    location : {
      type: { type: String, default: "Point"},
      coordinates: [{ type: Number }]
    },
    contents: { type: String, required: true },
    likes: { type: Number, default: 0, index: true },
    comments : [ commentSchema ],
    created_at : { type : Date, index: { unique : false }, default: Date.now }
  });

  messageSchema.index({ location: '2dsphere'});

  
  /*******************
   * 메소드 시작
  ********************/
  const select = {
    __v: false,
    _id: false
  };

  messageSchema.pre('save', function(next) {
    let doc = this;
    
    global.utils.mongo.seqModel.findByIdAndUpdate(
      {_id: "message"}, {$inc: {idx: 1}}, {upsert: true, new: true}, function(err, count) {

      if (err) {
        console.log(err);
        return next(err);
      }
      
      doc.idx = count.idx;
      next();
    });
  });

  // selectOne : 하나 조회하기
  messageSchema.static('selectOne', function (idx, callback) {
    return this.find({ idx: parseInt(idx) }, select, callback);
  });

  // selectAll : 전체 조회하기
  messageSchema.static('selectAll', function (page, callback) {
    if (!page) { // 페이지 인자가 없음 : 페이지네이션이 되지 않은 경우
      return this.find({}, select, callback)
        .sort('created_at');
    } else {     // 페이지 인자가 있음 : 페이지네이션 적용
      return this.find({}, select, callback)
        .sort('created_at')
        .skip((page-1) * paginationCount).limit(paginationCount);
    }
  });

  // selectCircle : 특정 반경 내의 값 조회하기
  messageSchema.static('selectCircle', function (conditions, page, callback) {
    /* where 안에 들어가는 이름은 해당 컬럼의 이름임에 주의한다! */
    if (!page) { // 페이지 인자가 없음 : 페이지네이션이 되지 않은 경우
      return this.find({}, select, callback)
        .where('location')
        .within(
          {
            center : [parseFloat(conditions.lng), parseFloat(conditions.lat)],
            radius : parseFloat(conditions.radius/6371000), // change radian: 1/6371 -> 1km
            unique : true, spherical : true
          }
        ).sort('-created_at');
    } else {     // 페이지 인자가 있음 : 페이지네이션 적용
      return this.find({}, select, callback)
        .where('location')
        .within(
          {
            center : [parseFloat(conditions.lng), parseFloat(conditions.lat)],
            radius : parseFloat(conditions.radius/6371000), // change radian: 1/6371 -> 1km
            unique : true, spherical : true
          }
        )
        .sort('-created_at')
        .skip((page-1) * paginationCount).limit(paginationCount);
    }
  });

  // like : 좋아요 누르기, 취소하기
  messageSchema.static('like', function (messageIdx, callback) {
    this.findOneAndUpdate(
      { idx: parseInt(messageIdx) },
      { $inc: { likes: 1} },
      { "fields": { idx: true, contents: true, likes: true, _id: false },
        new: true },
      callback
    );
  });

  // selectComments : 하나 조회하기
  messageSchema.static('selectComments', function (idx, callback) {
    return this.find({ idx: parseInt(idx) }, { idx: true, comments: true, _id: false }, callback);
  });

  // saveComment : 댓글 저장하기
  messageSchema.static('saveComment', function (messageIdx, data, callback) {
    this.findOneAndUpdate(
      { idx: parseInt(messageIdx) },
      { $push: { comments: data } },
      { "fields": { idx: true, comments: true, _id: false },
        new: true },
      callback
    );
  })

  return messageSchema;
};

module.exports = Schema;