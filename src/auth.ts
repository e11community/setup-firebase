import {writeFileSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import {getInput, info, setSecret, exportVariable, startGroup, endGroup} from '@actions/core'

const BASE64 = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/

export const login = async () => {
  startGroup('Firebase Authentication')

  let key = getInput('gcp_sa_key')
  if (!key) {
    throw new Error('gcp_sa_key is required to authenticate firebase-tools')
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

  endGroup()
}
