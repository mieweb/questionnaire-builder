# Releasing Packages

This repo uses **GitHub Actions + npm trusted publishing** to publish packages automatically when a labeled PR merges to `main`.

## Labels

Every release PR needs **at least one scope label** and **exactly one bump label**.

### Scope labels (which packages to publish)

| Label | Package |
|-------|---------|
| `scope:engine` | `@mieweb/forms-engine` |
| `scope:editor` | `@mieweb/forms-editor` |
| `scope:renderer` | `@mieweb/forms-renderer` |

You can combine multiple scope labels to publish several packages in one PR.

### Bump labels (version increment)

| Label | Effect | Example | npm tag |
|-------|--------|---------|--------|
| `bump:patch` | `2.1.3` → `2.1.4` | Bug fixes, small changes | `latest` |
| `bump:minor` | `2.1.3` → `2.2.0` | New features, backward-compatible | `latest` |
| `bump:major` | `2.1.3` → `3.0.0` | Breaking changes | `latest` |
| `bump:prerelease` | `2.1.3` → `2.1.4-prerelease.0` | Testing before a stable release | `next` |

> **Note:** The same bump type applies to all selected packages in the PR.

> **Prerelease:** Using `bump:prerelease` publishes under the `next` npm tag, so users on `latest` are unaffected. Install with `npm install @mieweb/forms-engine@next`. Subsequent `bump:prerelease` increments the prerelease number (`2.1.4-prerelease.0` → `2.1.4-prerelease.1`).

## How to release

1. Create your PR targeting `main`
2. Add the appropriate **scope** label(s) for the package(s) you changed
3. Add **one bump** label (`bump:patch`, `bump:minor`, or `bump:major`)
4. Get the PR reviewed and approved
5. Merge the PR

The release workflow will automatically:
- Bump the version in each selected package's `package.json`
- Sync cross-dependencies (e.g. if engine is bumped, editor/renderer deps update)
- Build all packages
- Publish to npm with provenance
- Commit the version changes and create git tags (e.g. `@mieweb/forms-engine@2.2.0`)

## Examples

### Patch a single package
Labels: `scope:renderer` + `bump:patch`
→ Publishes `@mieweb/forms-renderer@2.1.4`

### Minor release for engine + dependents
Labels: `scope:engine` + `scope:editor` + `scope:renderer` + `bump:minor`
→ Publishes all three at `2.2.0`, syncs engine dependency in editor/renderer

### Major breaking change in editor
Labels: `scope:editor` + `bump:major`
→ Publishes `@mieweb/forms-editor@3.0.0`

### Prerelease for testing
Labels: `scope:engine` + `bump:prerelease`
→ Publishes `@mieweb/forms-engine@2.1.4-prerelease.0` under `next` tag

## What if I forget a label?

- **No scope label** → workflow does not run
- **No bump label** → workflow does not run
- **Multiple bump labels** → `bump:prerelease` wins, then `patch`, then `minor`, then `major`
- You can add labels after creating the PR, before merging

## npm authentication

Packages are published using a **Granular Access Token** stored as the `NPM_TOKEN` repository secret.

1. On npmjs.com, create a Granular Access Token with publish access to `@mieweb/forms-engine`, `@mieweb/forms-editor`, and `@mieweb/forms-renderer`
2. In GitHub, go to **Settings → Secrets and variables → Actions** and add `NPM_TOKEN` with the token value
3. The workflow uses the `Production` GitHub environment for deployment protection.