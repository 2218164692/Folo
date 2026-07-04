const { dirname } = require("pathe")

const resolveFromExpo = (request) =>
  require.resolve(request, { paths: [dirname(require.resolve("expo/package.json"))] })

module.exports = function (api) {
  api.cache(true)
  return {
    presets: [
      [
        resolveFromExpo("babel-preset-expo"),
        { jsxImportSource: "nativewind", unstable_transformImportMeta: true },
      ],
      require.resolve("nativewind/babel"),
    ],
    plugins: [
      [require.resolve("babel-plugin-inline-import"), { extensions: [".sql"] }],
      require.resolve("react-native-worklets/plugin"),
    ],
  }
}
