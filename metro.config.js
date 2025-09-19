const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
const { withTamagui } = require('@tamagui/metro-plugin');

const config = getDefaultConfig(__dirname, {
    isCSSEnabled: true,
});

// Chain the plugins properly: first NativeWind, then Tamagui
const configWithNativeWind = withNativeWind(config, { input: './app/global.css' });
const configWithTamagui = withTamagui(configWithNativeWind, {
  components: ['tamagui'],
  config: './tamagui.config.ts',
  outputCSS: './tamagui-web.css',
});

module.exports = configWithTamagui;
