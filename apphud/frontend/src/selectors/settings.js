const getSettings = (state) => state.settings;

export const getDashboardPlatform = (state) => getSettings(state).platform;
