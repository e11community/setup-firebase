# setup-firebase

A GitHub Action that installs and authenticates the [`firebase-tools`](https://github.com/firebase/firebase-tools) CLI for use in the current job.

This action provides the following functionality:

- Install the `firebase-tools` CLI for use inside the current job
- Pin a specific version of the CLI to install
- Authenticate the CLI using a Google Cloud service account key
- Optionally activate a Firebase project (deprecated — see below)

> **Credit:** This is a fork of [`w9jds/setup-firebase`](https://github.com/w9jds/setup-firebase) by
> Jeremy Shore, modernized and maintained by Engineering 11. Thanks to Jeremy for the original work.

## Usage

> **Important:** `firebase-tools` is installed with `npm install -g`, so
> [`actions/setup-node`](https://github.com/actions/setup-node) must run first.

See [action.yml](action.yml) for the full input reference.

### Versioning

Pin the action to a released version rather than a branch:

- `e11community/setup-firebase@v1` — floating major tag; tracks the latest
  `v1.x.y` release (recommended; gets patches automatically).
- `e11community/setup-firebase@v1.0.0` — immutable pin to an exact release.

Avoid `@main`; it is the unstable development branch.

### Inputs

| Input           | Required | Description                                                                                                                                |
| --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `gcp_sa_key`    | yes      | Service account key (raw or base64-encoded JSON) used to authenticate `firebase-tools`. Exported as `GOOGLE_APPLICATION_CREDENTIALS`.      |
| `tools-version` | no       | Version of `firebase-tools` to install. Defaults to the latest release.                                                                    |
| `project_id`    | no       | **Deprecated.** Project to activate via `firebase use`. May be a project ID or a `.firebaserc` alias. Prefer `--project` on your commands. |
| `project_path`  | no       | **Deprecated.** Path to the folder containing `firebase.json` / `.firebaserc`; used as the working directory when activating the project.  |

Authentication uses a Google Cloud service account and is required: pass its key
as `gcp_sa_key` (raw JSON or base64-encoded). The key is written to the runner's
temporary directory and exported as `GOOGLE_APPLICATION_CREDENTIALS`, then
removed in a post-job step (relevant on self-hosted runners, where the temp
directory persists after the job).

> **Note:** `project_id` and `project_path` are deprecated and will be removed
> in a future release. Prefer passing `--project <id>` directly to your firebase
> commands.

### Basic example

```yaml
steps:
  - uses: actions/checkout@v4
  - uses: actions/setup-node@v4
    with:
      node-version: 20
  - uses: e11community/setup-firebase@v1
    with:
      tools-version: 13.0.0
      gcp_sa_key: ${{ secrets.GCP_SA_KEY }}
  - run: firebase deploy --only hosting --project my-project
  - run: firebase deploy --only functions --project my-project
```

The `tools-version` is optional; if omitted, the latest `firebase-tools` is
installed. Because major versions change behavior, pinning a version and
upgrading deliberately is recommended.

### Emulator example

```yaml
steps:
  - uses: actions/checkout@v4
  - uses: actions/setup-node@v4
    with:
      node-version: 20
  - uses: actions/setup-java@v4
    with:
      java-version: 17
  - uses: e11community/setup-firebase@v1
    with:
      tools-version: 13.0.0
      gcp_sa_key: ${{ secrets.GCP_SA_KEY }}
  - run: firebase emulators:exec --project my-project "npm test"
```

## Development

```bash
npm install
npm run format     # prettier --write .
npm run typecheck  # tsc --noEmit
npm run build      # esbuild bundles src/ into dist/action.js (main) and dist/cleanup.js (post)
```

The bundled `dist/action.js` (main step) and `dist/cleanup.js` (post step) are
committed and are what the action runs, so rebuild and commit them after
changing anything under `src/`.

## License

Released under the [MIT License](LICENSE).
