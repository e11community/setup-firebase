import {writeFileSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import {getInput, info, setSecret, exportVariable, saveState, startGroup, endGroup} from '@actions/core'

const BASE64 = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/

export const login = async () => {
  startGroup('Firebase Authentication')

  let key = getInput('gcp_sa_key')
  if (!key) {
    // No key: use the credentials an earlier step already exported, e.g.
    // google-github-actions/auth with Workload Identity Federation. firebase-tools
    // reads GOOGLE_APPLICATION_CREDENTIALS either way.
    const existing = process.env.GOOGLE_APPLICATION_CREDENTIALS
    if (!existing) {
      throw new Error(
        'gcp_sa_key is empty and GOOGLE_APPLICATION_CREDENTIALS is not set: pass a key, or authenticate first (e.g. google-github-actions/auth)'
      )
    }
    info(`No gcp_sa_key; using the existing GOOGLE_APPLICATION_CREDENTIALS (${existing})`)
    endGroup()
    return
  }
  setSecret(key)

  if (BASE64.test(key)) {
    key = Buffer.from(key, 'base64').toString('utf8')
    setSecret(key)
  }

  // Write to the runner's temp dir, which is always writable, rather than /opt.
  const keyPath = join(process.env.RUNNER_TEMP || tmpdir(), 'gcp_key.json')

  info(`Storing service account key into ${keyPath}`)
  writeFileSync(keyPath, key)
  exportVariable('GOOGLE_APPLICATION_CREDENTIALS', keyPath)

  // Record the path so the post step can remove the key after the job.
  saveState('keyPath', keyPath)

  endGroup()
}
