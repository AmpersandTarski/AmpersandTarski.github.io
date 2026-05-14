# AmpersandTarski Documentation Site

This repository contains the files and workflow needed to create a Docusaurus website for the Ampersand documentation.

## Table of Contents

- [Deployment Architecture](#deployment-architecture)
- [Local Development & Testing](#local-development--testing)
- [Production Deployment](#production-deployment)
- [Development Workflow](#development-workflow)
- [Troubleshooting](#troubleshooting)

## Deployment Architecture

The documentation is updated through the following automated workflows:

1. [AmpersandTarski.github.io](https://github.com/AmpersandTarski/AmpersandTarski.github.io) contains `DeployToPages.yml`, a GitHub Action which retrieves the `docs/` folders from [Ampersand](https://github.com/AmpersandTarski/Ampersand), [Prototype](https://github.com/AmpersandTarski/Prototype), and [RAP](https://github.com/AmpersandTarski/RAP) and deploys the Docusaurus website to [GitHub Pages](https://ampersandtarski.github.io/).
2. Each source repository contains `triggerDocsUpdate.yml`, a GitHub Action which triggers `DeployToPages.yml` on a push to `main` when changes are made to the `docs/` folder.

The trigger workflow looks like this:

```yaml
name: Trigger Documentation Update

on:
  push:
    branches:
      - main
    paths:
      - 'docs/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - run: |
          curl -XPOST -u "${{secrets.PAT_USERNAME}}:${{secrets.PAT_TOKEN}}" \
          -H "Accept: application/vnd.github.everest-preview+json" \
          -H "Content-Type: application/json" \
          https://api.github.com/repos/AmpersandTarski/AmpersandTarski.github.io/actions/workflows/DeployToPages.yml/dispatches \
          --data '{"ref": "main"}'
```

## Local Development & Testing

Test your documentation changes locally before pushing. A failed build in GitHub Actions appears minutes after pushing; a local build shows it in seconds.

### Prerequisites

- Docker Desktop installed and running
- The following repositories cloned locally:
  - `~/git/AmpersandTarski.github.io` (this repository)
  - `~/git/Ampersand` (Ampersand core documentation)
  - `~/git/PrototypeFramework` (Prototype framework documentation)
  - `~/git/RAP` (RAP documentation)

The instructions below assume this layout. Adjust paths to match your local setup.

### Quick Start

**1. Copy documentation sources into the `tmp/` staging area:**

```bash
cd ~/git/AmpersandTarski.github.io

rm -rf tmp && mkdir -p tmp
cp -R ~/git/Ampersand/docs tmp/ampersand
cp -R ~/git/PrototypeFramework/docs tmp/prototype
cp -R ~/git/RAP/docs tmp/rap
```

**2. Build and start the documentation site:**

```bash
docker compose up -d --build
```

The initial build takes 4–5 minutes (Node.js install + Docusaurus build). Subsequent builds take 2–3 minutes.

**3. Open the documentation:**

Visit http://localhost:8081

**4. Stop when done:**

```bash
docker compose down
```

### Rapid iteration

To test a single repository's changes without recopying all sources:

```bash
cp -R ~/git/PrototypeFramework/docs tmp/prototype
docker compose up -d --build
```

### What the local build tests

- ✅ Complete Docusaurus build process (same as production)
- ✅ Sidebar configuration and navigation structure
- ✅ Internal links and cross-references (`onBrokenLinks: 'throw'`)
- ✅ MDX syntax validity of all `.md` files

## Production Deployment

### Automated deployment

Pushing to `main` with changes in `docs/` automatically triggers `DeployToPages.yml`. The full cycle takes 5–10 minutes.

### Manual deployment

Via the GitHub Actions UI:

1. Go to the [Actions tab](https://github.com/AmpersandTarski/AmpersandTarski.github.io/actions)
2. Select "Deploy to Github pages"
3. Click "Run workflow"

## Development Workflow

1. **Make changes** in the source repository (`docs/` folder)
2. **Update `sidebar.js`** if adding new pages
3. **Test locally** following the Quick Start above
4. **Push to `main`** — GitHub Actions publishes automatically
5. **Verify** at https://ampersandtarski.github.io/ within 5–10 minutes

## Troubleshooting

### Local build fails

**MDX SyntaxError: Expected corresponding JSX closing tag for `<something>`**

Docusaurus 2.x parses `.md` files as MDX. Angle-bracket syntax that resembles an HTML tag — such as `<project-name>` or `<entry-file>` written as plain text — is treated as a JSX element. If there is no matching closing tag, the build fails.

Fix: put placeholder names inside backticks or a fenced code block.

```
# Wrong  (plain text — MDX parser sees a JSX tag)
./generate.sh <project-name> <entry-file>

# Correct (inside a code block — treated as literal text)
```bash
./generate.sh <project-name> <entry-file>
` ``
```

**Sidebar ID mismatch: no document with id "prototype/…"**

Cause: the markdown file has a custom `id:` field in its frontmatter whose value differs from the path-based ID that Docusaurus expects.

Example frontmatter that breaks things:
```yaml
---
id: prototype-framework
---
```

Docusaurus expects the ID to match the file path (`prototype/reference-material/prototype-framework`). If sidebar.js uses the path-based ID but the file declares a different one, Docusaurus cannot find the document.

Fix: remove the `id:` field from the frontmatter, or change it to match the path exactly.

**File not found / unknown doc ID**

Cause: a documentation file has no `.md` extension. Docusaurus ignores extensionless files.

Fix: rename the file to add `.md` (e.g. `back-end-services` → `back-end-services.md`).

### Port conflict on 8081

```bash
lsof -i :8081
```

Change the port in `docker-compose.yml` if 8081 is in use:

```yaml
ports:
  - 8082:80
```

### Build fails with Docker cache errors

```bash
docker compose build --no-cache
docker compose up -d
```

### Documentation not appearing

Verify that `tmp/prototype/` was copied correctly and that the new page is in `sidebar.js`:

```bash
ls tmp/prototype/guides/
cat tmp/prototype/sidebar.js
```

### Site not updating after push

1. Check the [Actions tab](https://github.com/AmpersandTarski/AmpersandTarski.github.io/actions) for build errors.
2. Force-refresh the browser (Cmd+Shift+R on Mac).
3. Check [GitHub Pages deployments](https://github.com/AmpersandTarski/AmpersandTarski.github.io/deployments).

## Container Details

- **Dockerfile for local testing**: `Dockerfile.localtest`
- **Dockerfile for production**: `Dockerfile` (downloads docs from GitHub at build time)
- **Base image**: nginx:stable-alpine
- **Port mapping**: 8081 (host) → 80 (container)
