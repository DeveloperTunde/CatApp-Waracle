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
            "@components": "./components",
            "@ui": "./components/ui",
            "@shared": "./components/shared",
            "@layouts": "./components/layouts",
            "@hooks": "./hooks",
            "@stores": "./stores",
            "@services": "./services",
            "@constants": "./constants",
            "@types": "./types",
            "@utils": "./utils",
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
