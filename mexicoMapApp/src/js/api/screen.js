/**
 * Created by developercomputer on 15.01.16.
 */
export default {
  landscape() {
    try {
      screen.lockOrientation('landscape');
    } catch(e) {
      console.log(e);
    }
  },
  portrait() {
    try {
      screen.lockOrientation('portrait');
    } catch(e) {
      console.log(e);
    }
  }
 };
