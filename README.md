# AmpersandTarski.github.io

This repository contains the files and workflow needed to create a Docusaurus website for the Ampersand documentation.

## Table of Contents

- [Deployment Architecture](#deployment-architecture)
- [Local Development & Testing](#local-development--testing)
- [Production Deployment](#production-deployment)
- [Development Workflow](#development-workflow)
- [Troubleshooting](#troubleshooting)

## Deployment Architecture

The Documentation is updated through the following automated workflows:

1. [AmpersandTarski.github.io](https://github.com/AmpersandTarski/AmpersandTarski.github.io) contains `DeployToPages.yml`, a GitHub Action which retrieves the "docs" folders from [Ampersand](https://github.com/AmpersandTarski/Ampersand) and [Prototype](https://github.com/AmpersandTarski/Prototype) and deploys the Docusaurus Website to [GitHub Pages](https://ampersandtarski.github.io/).
2. [Ampersand](https://github.com/AmpersandTarski/Ampersand) contains `triggerDocsUpdate.yml`, a GitHub Action which triggers `DeployToPages.yml` on a push to the development (main) branch when changes are made to the "docs" folder.
3. [Prototype](https://github.com/AmpersandTarski/Prototype) contains `triggerDocsUpdate.yml`, a GitHub Action which triggers `DeployToPages.yml` on a push to the development (main) branch when changes are made to the "docs" folder.

A GitHub Action can be called from an Action in a different Repository when the target Action contains: 
```yaml
on:
  workflow_dispatch:
```

The workflow can then be triggered by a different workflow with the following code:

```yaml
# Workflow which triggers the workflow in AmpersandTarski.github.io on changes to "Docs"
name: Trigger Documentation Update

on:
 # Runs on pushes targeting the development branch which contain changes in the "Docs" folder
  push:
    branches:
    - development
    paths:
    - 'docs/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    # Trigger the "DeployToPages" workflow in the "AmpersandTarski.github.io" repository
      - run: |
          curl -XPOST -u "${{secrets.PAT_USERNAME}}:${{secrets.PAT_TOKEN}}" \
          -H "Accept: application/vnd.github.everest-preview+json" -H \
          "Content-Type: application/json" https://api.github.com/repos/AmpersandTarski/AmpersandTarski.github.io/actions/workflows/DeployToPages.yml/dispatches \
          --data '{"ref": "main"}'
```

## Local Development & Testing

This guide explains how to test the Ampersand documentation locally using Docker, including your prototype framework documentation changes.

### Prerequisites

- Docker Desktop installed and running
- Access to the following repositories:
  - `/Users/sjo00577/git/AmpersandTarski.github.io` (this repository)
  - `/Users/sjo00577/git/Ampersand` (Ampersand core documentation)
  - `/Users/sjo00577/git/PrototypeFramework` (Prototype framework documentation)
  - `/Users/sjo00577/git/RAP` (RAP documentation)

### Quick Start Instructions

#### 1. Prepare Documentation Sources

Navigate to the documentation repository and copy all source documentation:

```bash
cd /Users/sjo00577/git/AmpersandTarski.github.io

# Clean and recreate tmp directory
rm -rf tmp && mkdir -p tmp

# Copy documentation from all source repositories
cp -R /Users/sjo00577/git/Ampersand/docs tmp/ampersand
cp -R /Users/sjo00577/git/PrototypeFramework/docs tmp/prototype  
cp -R /Users/sjo00577/git/RAP/docs tmp/rap
```

#### 2. Build and Run Documentation

Build and start the documentation site:

```bash
docker compose up -d --build
```

**Note**: The initial build takes ~4-5 minutes as it installs Node.js dependencies and compiles all documentation.

#### 3. Access the Documentation

Open your browser and navigate to:
- **Main site**: http://localhost:8081

Your prototype framework documentation should appear under:
- **Guides section**: "Creating Custom BOX Templates" and "Documenting Prototype Changes"
- **Reference section**: "BOX Template Architecture"

#### 4. Stop the Documentation Server

When finished testing:

```bash
docker compose down
```

### Testing Workflow for Documentation Changes

#### For Prototype Framework Changes

1. Make changes to files in `/Users/sjo00577/git/PrototypeFramework/docs/`
2. Update `sidebar.js` if adding new documents
3. Follow the Quick Start Instructions above to test locally
4. Verify your changes appear correctly at http://localhost:8081

#### For Rapid Iteration

If you're making frequent changes and want faster testing:

1. Keep the container running
2. Make changes to source documentation
3. Rebuild only when needed:
   ```bash
   # Copy updated docs
   cp -R /Users/sjo00577/git/PrototypeFramework/docs tmp/prototype
   
   # Rebuild and restart
   docker compose up -d --build
   ```

### What Gets Tested

The local deployment tests:

- ✅ Complete Docusaurus build process
- ✅ All documentation sources (Ampersand, Prototype, RAP)
- ✅ Navigation structure and sidebar configuration  
- ✅ Search functionality (Algolia)
- ✅ Responsive design and styling
- ✅ Internal links and cross-references
- ✅ Math equation rendering (KaTeX)

### Local Testing File Structure

```
/Users/sjo00577/git/AmpersandTarski.github.io/
├── docker-compose.yml          # Docker configuration
├── Dockerfile.localtest        # Local testing Dockerfile  
├── ampersand-docs/             # Docusaurus configuration
│   ├── package.json           # Dependencies
│   ├── docusaurus.config.js   # Site configuration
│   └── sidebars.js            # Navigation configuration
└── tmp/                       # Copied documentation sources
    ├── ampersand/             # From Ampersand repository
    ├── prototype/             # From PrototypeFramework repository
    └── rap/                   # From RAP repository
```

### Success Verification

Your local deployment is working correctly when:

1. ✅ http://localhost:8081 loads successfully
2. ✅ Navigation shows "Guides" and "Reference materials" sections
3. ✅ "Creating Custom BOX Templates" appears under Guides
4. ✅ "BOX Template Architecture" appears under Reference materials
5. ✅ Search functionality works
6. ✅ All internal links function properly

## Production Deployment

### Automated Deployment Process

The production deployment to [https://ampersandtarski.github.io/](https://ampersandtarski.github.io/) is fully automated through GitHub Actions:

1. **Build Process**:
   - GitHub Actions workflow (`DeployToPages.yml`) triggers on pushes to main branch
   - Docker builds the documentation using `Dockerfile`
   - Static content is extracted from the Docker container
   - Artifact is uploaded to GitHub Pages

2. **Cross-Repository Integration**:
   - Changes to documentation in Ampersand or Prototype repositories automatically trigger deployment
   - Uses Personal Access Token (PAT) authentication for cross-repository workflow dispatch

3. **Deployment Timeline**:
   - Build process: ~4-5 minutes
   - GitHub Pages deployment: ~2-3 minutes
   - Total deployment time: ~5-10 minutes

### Manual Deployment

To manually trigger a deployment:

1. **Via GitHub Actions UI**:
   - Go to [Actions tab](https://github.com/AmpersandTarski/AmpersandTarski.github.io/actions)
   - Select "Deploy to Github pages" workflow
   - Click "Run workflow" button

2. **Via Git Push**:
   ```bash
   # Make any change to trigger deployment
   git commit --allow-empty -m "Trigger deployment"
   git push origin main
   ```

## Development Workflow

### For Documentation Contributors

1. **Make Changes**:
   - Edit documentation files in the source repositories (Ampersand, PrototypeFramework, RAP)
   - Update `sidebar.js` if adding new documents

2. **Local Testing**:
   - Follow the [Local Development & Testing](#local-development--testing) instructions
   - Verify changes render correctly at http://localhost:8081

3. **Deploy to Production**:
   - Commit and push changes to the main/development branch of the source repository
   - GitHub Actions will automatically update https://ampersandtarski.github.io/
   - Verify deployment on the live site within 5-10 minutes

### For Repository Maintainers

1. **Monitor Deployments**:
   - Check [GitHub Actions](https://github.com/AmpersandTarski/AmpersandTarski.github.io/actions) for build status
   - Monitor [GitHub Pages settings](https://github.com/AmpersandTarski/AmpersandTarski.github.io/settings/pages) for deployment status

2. **Troubleshoot Issues**:
   - Review build logs in GitHub Actions
   - Test locally using Docker setup
   - Check for broken links or missing files

## Troubleshooting

### Local Testing Issues

#### Port Conflicts

If you encounter port conflicts:

1. Check what's using the port:
   ```bash
   lsof -i :8081
   ```

2. Modify `docker-compose.yml` to use a different port:
   ```yaml
   ports:
     - 8082:80  # Change 8081 to 8082 or another available port
   ```

#### Build Issues

If the build fails:

1. Clean Docker cache:
   ```bash
   docker system prune -f
   ```

2. Rebuild without cache:
   ```bash
   docker compose build --no-cache
   docker compose up -d
   ```

#### Missing Documentation

If your documentation doesn't appear:

1. Verify files were copied correctly:
   ```bash
   ls -la tmp/prototype/guides/
   # Should show: creating-custom-box-templates.md, documenting-prototype-changes.md
   ```

2. Check sidebar configuration:
   ```bash
   cat tmp/prototype/sidebar.js
   # Should include your new guides in prototypeGuideSidebar
   ```

### Production Deployment Issues

#### Failed GitHub Actions

1. **Check Build Logs**:
   - Go to [Actions tab](https://github.com/AmpersandTarski/AmpersandTarski.github.io/actions)
   - Click on the failed workflow run
   - Review error messages in the build logs

2. **Common Issues**:
   - Missing documentation files in source repositories
   - Broken markdown links or syntax errors
   - Docker build failures due to missing dependencies
   - GitHub Pages deployment quota exceeded

#### Site Not Updating

1. **Clear Browser Cache**: Force refresh with Ctrl+F5 (or Cmd+Shift+R on Mac)
2. **Check GitHub Pages Status**: Visit [GitHub Status](https://status.github.com/) for platform issues
3. **Verify Deployment**: Check the [deployments page](https://github.com/AmpersandTarski/AmpersandTarski.github.io/deployments)

### Getting Help

1. **Check existing issues**: [GitHub Issues](https://github.com/AmpersandTarski/AmpersandTarski.github.io/issues)
2. **Create new issue**: Provide build logs and error messages
3. **Test locally first**: Always verify your changes work in local environment before reporting production issues

## Container Details

- **Base Image**: nginx:stable-alpine
- **Build Process**: Two-stage (Node.js build → Nginx serve)
- **Port Mapping**: External 8081 → Internal 80
- **Build Time**: ~4-5 minutes (first build)
- **Rebuild Time**: ~2-3 minutes (subsequent builds)

## Notes

- The local environment exactly matches the production build process
- All documentation changes should be tested locally before pushing
- The Docker approach ensures consistent builds across different development environments
- Port 8081 is used to avoid conflicts with other local services (port 80 often used by other containers)
- **Important**: Local testing instructions are kept in sync with production deployment processes
