import React from "react";
import { usePromiseTracker } from "react-promise-tracker";
import Loader from "react-loader-spinner";

export default class LoadingIndicator extends React.Component {
  render() {
    // const { promiseInProgress } = usePromiseTracker();
    // promiseInProgress &&
    return (
      <div
        style={{
          width: "100%",
          height: "100",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loader type="Oval" color="#52aea2" height="50" width="100" />
      </div>
    );
  }
}
