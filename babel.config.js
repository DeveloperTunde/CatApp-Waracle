module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["."],
          extensions: [".ios.js", ".android.js", ".js", ".ts", ".tsx", ".json"],
          alias: {
            "@": ".",
            "@components": "./src/components",
            "@ui": "./src/components/ui",
            "@shared": "./src/components/shared",
            "@layouts": "./src/components/layouts",
            "@hooks": "./src/hooks",
            "@stores": "./src/stores",
            "@services": "./src/services",
            "@constants": "./src/constants",
            "@types": "./src/types",
            "@utils": "./src/utils",
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
