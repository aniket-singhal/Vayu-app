module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'], // This is what was missing!
    plugins: [
      'react-native-reanimated/plugin',
    ],
  };
};