const TRUE_VALUES = new Set(["1", "true", "yes", "on"])
const FALSE_VALUES = new Set(["0", "false", "no", "off"])

const readPublicBoolean = (name: string, fallback: boolean) => {
  const value = process.env[name]?.trim().toLowerCase()

  if (!value) {
    return fallback
  }

  if (TRUE_VALUES.has(value)) {
    return true
  }

  if (FALSE_VALUES.has(value)) {
    return false
  }

  return fallback
}

export const isPersonalBuild = readPublicBoolean("EXPO_PUBLIC_PERSONAL_BUILD", false)

const defaultFeatureState = !isPersonalBuild

export const mobileFeatureFlags = {
  account: readPublicBoolean("EXPO_PUBLIC_ENABLE_ACCOUNT", defaultFeatureState),
  ai: readPublicBoolean("EXPO_PUBLIC_ENABLE_AI", defaultFeatureState),
  analytics: readPublicBoolean("EXPO_PUBLIC_ENABLE_ANALYTICS", defaultFeatureState),
  about: readPublicBoolean("EXPO_PUBLIC_ENABLE_ABOUT", defaultFeatureState),
  paidSubscription: readPublicBoolean(
    "EXPO_PUBLIC_ENABLE_PAID_SUBSCRIPTION",
    defaultFeatureState,
  ),
  reviewPrompts: readPublicBoolean("EXPO_PUBLIC_ENABLE_REVIEW_PROMPTS", defaultFeatureState),
  supportAndFeedback: readPublicBoolean(
    "EXPO_PUBLIC_ENABLE_SUPPORT_FEEDBACK",
    defaultFeatureState,
  ),
  tts: readPublicBoolean("EXPO_PUBLIC_ENABLE_TTS", defaultFeatureState),
  updates: readPublicBoolean("EXPO_PUBLIC_ENABLE_UPDATES", defaultFeatureState),
} as const
