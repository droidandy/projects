const TYPE = {
  SET_PLATFORM: 'SET_PLATFORM',
  SET_RESOLUTION: 'SET_RESOLUTION',
  SET_MAP: 'SET_MAP',
  SET_BANNERIMAGE: 'SET_BANNERIMAGE'
};

export let setResolution = (width, height, isMobile) => ({
  type: TYPE.SET_RESOLUTION,
  width,
  height,
  isMobile
});

export let setMap = (openMap) => ({
  type: TYPE.SET_MAP,
  openMap
});

export let setBackgroundImage = (bannerImage) => ({
  type: TYPE.SET_BANNERIMAGE,
  bannerImage
});

export let setPlatform = (isDevice) => ({
  type: TYPE.SET_PLATFORM,
  isDevice
});

const initialState = {
  width: 1000,
  height: 1000,
  isMobile: false,
  isDevice: null,
  openMap: false,
  bannerImage: null
};

export default (_state = initialState, action = {}) => {
  let state = {..._state};
  switch (action.type) {
    case TYPE.SET_PLATFORM:
      return {
        ...state,
        isDevice: action.isDevice
      };
    case TYPE.SET_RESOLUTION:
      return {
        ...state,
        width: action.width,
        height: action.height,
        isMobile: action.isMobile
      };
    case TYPE.SET_MAP:
      return {
        ...state,
        openMap: action.openMap
      };
    case TYPE.SET_BANNERIMAGE:
      return {
        ...state,
        bannerImage: action.bannerImage
      };
    default:
      return state;
  }
};
