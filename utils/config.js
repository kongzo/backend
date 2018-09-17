/******************************************************************************
' 파일     : config.js
' 작성     : 박소영
' 목적     : mongoDB 스키마와 모델, 페이지네이션 단위 등 서버의 변수들을 변경할 수 있는 파일입니다.
******************************************************************************/

module.exports = {
  db_schemas : [
    {
      file: '../schemas/MessageSchema',
      collection: 'message',
      schemaName: 'messageSchema',
      modelName: 'messageModel'
    },
    {
      file: '../schemas/SeqSchema',
      collection: 'sequence',
      schemaName: 'seqSchema',
      modelName: 'seqModel'
    }
  ],
  radius: 50,
  pagination_count: 20
}
