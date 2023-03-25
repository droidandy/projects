// import configcat from "configcat-node";

import { getAllUrlParams } from "../url";
import buildConfig from "../../build_config";

export const isDebugOn = () => {
  if (!buildConfig.production) return true;
  if (getAllUrlParams().debug) return true;
  if (["127.0.0.1", "localhost"].includes(window.location.hostname))
    return true;

  return false;
};
