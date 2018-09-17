/******************************************************************************
' 파일     : helpers.js
' 작성     : 박소영
' 목적     : 서버 내에서 두루 쓰이는 helper 함수들의 모음입니다.
******************************************************************************/

exports.getCurrentDate = () => {
  var date = new Date();
 
  var year = date.getFullYear();
  var month = date.getMonth();
  var today = date.getDate();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  var milliseconds = date.getMilliseconds();
 
  return new Date(Date.UTC(year, month, today, hours, minutes, seconds, milliseconds));
}