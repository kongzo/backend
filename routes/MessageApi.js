const messageCtrl = require('../controllers/MessageCtrl');

module.exports = (router) => {  
  /* 메시지 작성 */
  router.route('/message')    
    .post(messageCtrl.save);

  /* 특정 메시지 세부 내용 조회 */
  router.route('/message/:idx')
    .get(messageCtrl.selectOne);
  
  /* 특정 반경 내의 메시지 리스트 조회 */
  router.route('/messages')                // All
    .post(messageCtrl.selectCircle);
  router.route('/messages/:page')          // Paged
    .post(messageCtrl.selectCircle);

  /* 메시지 좋아요 */
  router.route('/like/:idx')
    .get(messageCtrl.like);

  /* 댓글 작성 */
  // router.route('/comment/:idx')
  //   .get(messageCtrl.selectComments)
  //   .post(messageCtrl.saveComment);


  return router;
};