/**
 * Created by developercomputer on 27.01.16.
 */
export default function shuffle(arr) {
  var b = arr.slice();
  var temp;
  for(var i = 0, len = b.length; i < len - 1; i++) {
    for(var j = i; j < len - 1; j++) {
      var r = Math.floor(Math.random()*len);
      temp = b[r];
      b[r] = b[j];
      b[j] = temp;
    }
  }
  return b;
}