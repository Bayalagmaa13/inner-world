// PDF файлыг (CV) апп-ын asset болгон оруулахын тулд
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
config.resolver.assetExts.push('pdf');

// three 0.187-ийн CommonJS хувилбар (three.cjs) нь Node-ийн `process.emitWarning`-г дууддаг тул
// утсан дээр "undefined is not a function" алдаа гаргадаг. ES module хувилбарыг шууд ашиглана.
const THREE_ESM = path.join(__dirname, 'node_modules/three/build/three.module.js');
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'three') {
    return { type: 'sourceFile', filePath: THREE_ESM };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
