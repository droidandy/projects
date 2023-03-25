/**
 * Created by developercomputer on 07.02.16.
 */
import questions from "./../content/capitals-test";
import shuffle from "./../utils/array-shufle";

const mapReducer = (state = questions, action = {}) => {
  switch(action.type) {
    case "TEST_START":
        return shuffle(state);
      break;
    default:
      return state;
      break;
  }
};

export default mapReducer;
