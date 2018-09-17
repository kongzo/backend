
const mongoose = require('mongoose');

let Schema = {};

Schema.createSchema = (mongoose) => {
  const commentSchema = mongoose.Schema({
    nickname: { type: String, required: true },
    contents: { type: String, required: true },
    created_at : { type : Date, index: { unique : false }, default: Date.now }
  });

  return commentSchema;
};

module.exports = Schema;