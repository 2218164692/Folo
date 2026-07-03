import { useMemo } from "react"

export interface DisabledUpdatesManifest {
  metadata?: Record<string, unknown>
  runtimeVersion?: string
}

export const runtimeVersion: string | null = null
export const channel = "disabled"
export const isEnabled = false

export const UpdateInfoType = {
  NEW: "new",
} as const

export const useUpdates = () => {
  return useMemo(
    () => ({
      checkError: null,
      currentlyRunning: {
        manifest: undefined as DisabledUpdatesManifest | undefined,
        runtimeVersion,
      },
      downloadError: null,
      downloadedUpdate: null,
      isUpdatePending: false,
    }),
    [],
  )
}

export const checkForUpdateAsync = async () => ({ isAvailable: false })
export const fetchUpdateAsync = async () => ({
  isNew: false,
  manifest: undefined as DisabledUpdatesManifest | undefined,
})
export const reloadAsync = async () => {}
