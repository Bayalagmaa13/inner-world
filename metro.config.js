// PDF файлыг (CV) апп-ын asset болгон оруулахын тулд
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
config.resolver.assetExts.push('pdf');

module.exports = config;
