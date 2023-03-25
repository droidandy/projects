module.exports = function(api) {
  api.cache(true);
  return {
    plugins: ['inline-import'],
    presets: ['babel-preset-expo'],
  };
};
