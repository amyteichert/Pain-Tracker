module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'expo-router/babel',          // 🔥 DAS HIER FEHLT BEI DIR
      'react-native-reanimated/plugin',
    ],
  };
};