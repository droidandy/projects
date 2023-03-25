/**
 * Created by developercomputer on 11.01.16.
 */
import Radium from "radium";

export default {
  container: {
    width: "100%",
    height: "100%",
    position: "relative"
  },
  questionContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "80%",
    margin: "auto"
  },
  question: {
    width: "100%",
    height: "30%",
    fontSize: 24,
    fontWeight: 300,
    color: "#333",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center"
  },
  answersContainer: {
    width: "100%",
    height: "70%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center"
  },
  answer: {
    width: "90%",
    margin: "auto",
    minHeight: "20%",
    fontSize: 22,
    fontWeight: 200,
    color: "#222",
    border: "1px solid rgba(0,0,0, .4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center"
  }
};