import React from "react";
import { connect as reduxConnect } from "react-redux";

export const connect = (
  mapStateToProps,
  mapDispatchToProps = null,
  mergeProps = null,
  options = {}
) => {
  const combinedMapStateToProps = (mapStateToProps) => {
    return (state: ReduxShape, ownProps) => {
      const extendedProps =
        typeof mapStateToProps == "function"
          ? { ...ownProps, ...mapStateToProps(state, ownProps) }
          : ownProps;

      const mergedProps = {
        ...ownProps,
        ...extendedProps,
      };

      mergedProps.lang =
        mergedProps.lang != undefined
          ? mergedProps.lang
          : state.app.localizationSettings.languageCode;

      /* console.log("ownProps", ownProps);
      console.log("mergeProps", mergeProps);

      console.log("extendedProps", extendedProps);
      console.log("mergedProps", mergedProps);
 */
      return mergedProps;
    };
  };

  return reduxConnect(
    combinedMapStateToProps(mapStateToProps),
    mapDispatchToProps,
    mergeProps,
    options
  );
};
