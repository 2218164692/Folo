const { withPodfile } = require("expo/config-plugins")

const EXPO_UPDATES_PACKAGE = "expo-updates"
const EXPO_UPDATES_EXCLUDE_LINE = `exclude: ['${EXPO_UPDATES_PACKAGE}']`
const USE_EXPO_MODULES_PATTERN = /^(\s*)use_expo_modules!\s*$/m

module.exports = function withDisabledExpoUpdates(config) {
  return withPodfile(config, (config) => {
    const contents = config.modResults.contents

    if (contents.includes(EXPO_UPDATES_EXCLUDE_LINE)) {
      return config
    }

    if (!USE_EXPO_MODULES_PATTERN.test(contents)) {
      throw new Error("Could not find the use_expo_modules! call in the iOS Podfile.")
    }

    config.modResults.contents = contents.replace(
      USE_EXPO_MODULES_PATTERN,
      `$1use_expo_modules!(
$1  ${EXPO_UPDATES_EXCLUDE_LINE},
$1)`,
    )

    return config
  })
}
