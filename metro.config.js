const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

module.exports = async () => {
  const defaultConfig = await getDefaultConfig(__dirname);
  const {
    resolver: { assetExts },
  } = defaultConfig;
  
  const config = {
    resolver: {
      assetExts: [...assetExts, 'tflite', 'onnx'],
    },
  };
  
  return mergeConfig(defaultConfig, config);
};