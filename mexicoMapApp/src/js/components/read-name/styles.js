/**
 * Created by developercomputer on 11.01.16.
 */
import Radium from "radium";

const calcLeftMargin = (w) => {
  const n = Math.floor(100/w);
  return (100 - w*n)/(n+1);
};

const messageAppear = Radium.keyframes({
  '0%': { opacity: '0', transform: "scale(1.1) translate3d(0,-40px,0)", visibility: "visible" },
  '100%': { opacity: '1', transform: "scale(1) translate3d(0,0,0)", visibility: "visible" }
}, 'message-appear');

const messageDisappear = Radium.keyframes({
  '0%': { opacity: '1', transform: "scale(1) translate3d(0,0,0)", visibility: "visible" },
  '100%': { opacity: '0', transform: "scale(0.9) translate3d(0,40px,0)", visibility: "hidden" }
}, 'message-disappear');

export default {
  container: {
    display: "flex",
    flexFlow: "row wrap",
    position: "relative",
    width: "100%",
    height: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "#727272"
  },
  item: {
    width: "15%",
    height: "80px",
    fontSize: "0.7rem",
    fontWeight: "300",
    color: "#fff",
    backgroundColor: "#512DA8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    borderRadius: "5px",
    marginTop: "20px",
    marginLeft: `${calcLeftMargin(15)}%`
  },
  message: {
    width: "280px",
    height: "200px",
    transform: "scale(1.1) translate3d(0,-40px,0)",
    position: "absolute",
    zIndex: "120",
    left: "50%",
    top: "50%",
    marginTop: "-100px",
    marginLeft: "-140px",
    opacity: 0,
    transition: "all 400ms ease",
    borderRadius: "5px",
    backgroundColor: "rgba(255,255,255, .8)",
    color: "#333",
    fontSize: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    visibility: "hidden"
  },
  messageShow: {
    animation: 'x 1s ease 0s',
    animationName: messageAppear
  },
  messageHide: {
    animation: 'x 1s ease 0s',
    animationName: messageDisappear
  },
  overlay: {
    position: "absolute",
    left: 0,
    top: 0,
    transform: "translate3d(0,0,0)",
    zIndex: "140",
    width: "100%",
    height: "100%"
  }
};
