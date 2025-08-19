# Local Documentation Testing Instructions

This guide explains how to test the Ampersand documentation locally using Docker, including your prototype framework documentation changes.

## Prerequisites

- Docker Desktop installed and running
- Access to the following repositories:
  - `/Users/sjo00577/git/AmpersandTarski.github.io` (this repository)
  - `/Users/sjo00577/git/Ampersand` (Ampersand core documentation)
  - `/Users/sjo00577/git/PrototypeFramework` (Prototype framework documentation)
  - `/Users/sjo00577/git/RAP` (RAP documentation)

## Quick Start Instructions

### 1. Prepare Documentation Sources

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

### 2. Build and Run Documentation

Build and start the documentation site:

```bash
docker compose up -d --build
```

**Note**: The initial build takes ~4-5 minutes as it installs Node.js dependencies and compiles all documentation.

### 3. Access the Documentation

Open your browser and navigate to:
- **Main site**: http://localhost:8081

Your prototype framework documentation should appear under:
- **Guides section**: "Creating Custom BOX Templates" and "Documenting Prototype Changes"
- **Reference section**: "BOX Template Architecture"

### 4. Stop the Documentation Server

When finished testing:

```bash
docker compose down
```

## Troubleshooting

### Port Conflicts

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

### Build Issues

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

### Missing Documentation

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

## Testing Workflow for Documentation Changes

### For Prototype Framework Changes

1. Make changes to files in `/Users/sjo00577/git/PrototypeFramework/docs/`
2. Update `sidebar.js` if adding new documents
3. Follow the Quick Start Instructions above to test locally
4. Verify your changes appear correctly at http://localhost:8081

### For Rapid Iteration

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

## What Gets Tested

The local deployment tests:

- ✅ Complete Docusaurus build process
- ✅ All documentation sources (Ampersand, Prototype, RAP)
- ✅ Navigation structure and sidebar configuration  
- ✅ Search functionality (Algolia)
- ✅ Responsive design and styling
- ✅ Internal links and cross-references
- ✅ Math equation rendering (KaTeX)

## Container Details

- **Base Image**: nginx:stable-alpine
- **Build Process**: Two-stage (Node.js build → Nginx serve)
- **Port Mapping**: External 8081 → Internal 80
- **Build Time**: ~4-5 minutes (first build)
- **Rebuild Time**: ~2-3 minutes (subsequent builds)

## File Structure

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

## Success Verification

Your local deployment is working correctly when:

1. ✅ http://localhost:8081 loads successfully
2. ✅ Navigation shows "Guides" and "Reference materials" sections
3. ✅ "Creating Custom BOX Templates" appears under Guides
4. ✅ "BOX Template Architecture" appears under Reference materials
5. ✅ Search functionality works
6. ✅ All internal links function properly

## Next Steps

After successful local testing:

1. Commit your documentation changes to the PrototypeFramework repository
2. Push to the main/development branch
3. The GitHub Actions will automatically update https://ampersandtarski.github.io/
4. Verify deployment on the live site within 5-10 minutes

## Notes

- The local environment exactly matches the production build process
- All documentation changes should be tested locally before pushing
- The Docker approach ensures consistent builds across different development environments
- Port 8081 is used to avoid conflicts with other local services (port 80 often used by other containers)
