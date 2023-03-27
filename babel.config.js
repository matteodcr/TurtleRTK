module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [['react-native-reanimated/plugin'],
  ['@babel/plugin-proposal-decorators', {"newDecorators": true, "decoratorsBeforeExport": true}],
  ["@babel/plugin-proposal-class-properties", { "loose": true }],],
  
};
