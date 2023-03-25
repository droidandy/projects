/**
 * Created by developercomputer on 14.01.16.
 */
import Radium from "radium";

const bodyWidth = document.body.offsetWidth;

const mediaQueryWidth = (width) => `@media (min-width: ${width}px)`;

export default {
  wrapper: {
    position: "relative",
    display: "flex",
    flexFlow: "row wrap",
    justifyContent: "space-around",
    backgroundColor: "#ebebeb",
    paddingTop: `${35 - (bodyWidth * (1 - 0.47*2)/2)}px`,
    paddingBottom: 20
  },
  menuItem: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    position: "relative",
    width: "47%",
    height: 225,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    boxShadow: "0 3px 0 #cccccc",
    marginTop: `${bodyWidth * (1 - 0.47*2)/2}px`
  },
  menuItemCircle: {
    width: bodyWidth * 0.47 * 0.72,
    height: bodyWidth * 0.47 * 0.72,
    borderRadius: "50%",
    //background: "#000",
    marginBottom: 40,
    [mediaQueryWidth(660)]: {
      width: 150,
      height: 150
    }
  },
  menuItemTitle: {
    width: "100%",
    position: "absolute",
    bottom: 20,
    //marginTop: 20,
    fontSize: 21,
    fontWeight: "bold",
    textAlign: "center"
  }
};
