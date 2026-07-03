const { getDefaultConfig } = require("expo/metro-config")
const { withNativeWind } = require("nativewind/metro")
const path = require("pathe")
const { wrapWithReanimatedMetroConfig } = require("react-native-reanimated/metro-config")

const config = getDefaultConfig(__dirname, { isCSSEnabled: true })
const workspaceRoot = path.resolve(__dirname, "../..")
const trueValues = new Set(["1", "true", "yes", "on"])
const falseValues = new Set(["0", "false", "no", "off"])
const readPublicBoolean = (name, fallback) => {
  const value = String(process.env[name] || "")
    .trim()
    .toLowerCase()

  if (!value) return fallback
  if (trueValues.has(value)) return true
  if (falseValues.has(value)) return false
  return fallback
}
const isPersonalBuild = readPublicBoolean("EXPO_PUBLIC_PERSONAL_BUILD", false)
const isUpdatesEnabled = readPublicBoolean("EXPO_PUBLIC_ENABLE_UPDATES", !isPersonalBuild)
const disabledExpoUpdatesPath = path.resolve(
  __dirname,
  "./src/modules/ota/expo-updates-disabled.ts",
)
config.resolver.sourceExts.push("sql")

config.transformer.getTransformOptions = async () => ({
  transform: {
    inlineRequires: true,
  },
})

config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, "./node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
]

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  "@locales": path.resolve(__dirname, "../../locales"),
}

config.watchFolders = Array.from(
  new Set([...config.watchFolders, workspaceRoot, path.resolve(workspaceRoot, "locales")]),
)

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (!isUpdatesEnabled && moduleName === "expo-updates") {
    return {
      type: "sourceFile",
      filePath: disabledExpoUpdatesPath,
    }
  }

  const result = context.resolveRequest(context, moduleName, platform)
  if (result.type === "sourceFile") {
    const lastDotIndex = result.filePath.lastIndexOf(".")
    const mobilePath = `${result.filePath.slice(0, lastDotIndex)}.rn${result.filePath.slice(lastDotIndex)}`
    const file = context.fileSystemLookup(mobilePath)
    if (file.exists) {
      return {
        ...result,
        filePath: mobilePath,
      }
    } else {
      return result
    }
  }
  return result
}

module.exports = wrapWithReanimatedMetroConfig(
  withNativeWind(config, { input: "./src/global.css" }),
)
