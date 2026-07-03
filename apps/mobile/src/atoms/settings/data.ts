import type { DataSettings } from "@/src/interfaces/settings/data"
import { mobileFeatureFlags } from "@/src/config/personal-build"

import { createSettingAtom } from "./internal/helper"

export const createDefaultSettings = (): DataSettings => ({
  sendAnonymousData: mobileFeatureFlags.analytics,
})

export const {
  useSettingKey: useDataSettingKey,
  useSettingSelector: useDataSettingSelector,
  useSettingKeys: useDataSettingKeys,
  setSetting: setDataSetting,
  clearSettings: clearDataSettings,
  initializeDefaultSettings: initializeDefaultDataSettings,
  getSettings: getDataSettings,
  useSettingValue: useDataSettingValue,
} = createSettingAtom("data", createDefaultSettings)
