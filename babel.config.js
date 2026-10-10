module.exports = {
  plugins: [
    "@babel/plugin-transform-class-static-block",
    "@babel/plugin-transform-private-methods",
    "@babel/plugin-transform-private-property-in-object",
    "@babel/plugin-transform-class-properties"
  ],
  presets: ['module:metro-react-native-babel-preset']
};
