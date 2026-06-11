import {getInput, info, warning, startGroup, endGroup} from '@actions/core'
import {exec} from '@actions/exec'

export const setupProject = async () => {
  const projectId = getInput('project_id')
  const path = getInput('project_path')

  if (!projectId && !path) {
    return
  }

  startGroup('Setup Project')

  if (path) {
    warning('`project_path` is deprecated and will be removed in a future release.')
  }

  if (projectId) {
    warning('`project_id` is deprecated and will be removed in a future release. Prefer passing `--project` to your firebase commands.')
    info(`Activating Firebase project ${projectId}`)
    // `firebase use <id>` (no --add) is non-interactive; --add was the legacy
    // interactive alias flow. The id may also be a .firebaserc alias.
    await exec('firebase', ['use', projectId], path ? {cwd: path} : undefined)
  }

  endGroup()
}
