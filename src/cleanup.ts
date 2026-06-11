import {rmSync} from 'node:fs'
import {getState, info, warning} from '@actions/core'

// Post step: remove the service account key written during the main step.
// Matters most on self-hosted runners, where RUNNER_TEMP persists after the
// job and the raw credentials would otherwise sit readable on disk.
const cleanup = () => {
  const keyPath = getState('keyPath')
  if (!keyPath) {
    return
  }

  try {
    rmSync(keyPath, {force: true})
    info(`Removed service account key at ${keyPath}`)
  } catch (ex) {
    warning(`Failed to remove service account key at ${keyPath}: ${ex instanceof Error ? ex.message : ex}`)
  }
}

cleanup()
