# DocuGen
This repository contains the files and workflow needed to create a Docusaurus website for the Ampersand documentation.
The Documentation is updated through the following workflows:

1. [DocuGen](https://github.com/AmpersandTarski/DocuGen) contains `DeployToPages.yml`, a GitHub Action which retrieves the "docs" folders from [Ampersand](https://github.com/AmpersandTarski/Ampersand) and [Prototype](https://github.com/AmpersandTarski/Prototype) and deploys the Docusaurus Website to [GitHub Pages](https://ampersandtarski.github.io/DocuGen/).
2. [Ampersand](https://github.com/AmpersandTarski/Ampersand) contains `triggerDocsUpdate.yml`, a GitHub Action which triggers `DeployToPages.yml` on a push to the development (main) branch when changes are made to the "docs" folder.
3. [Prototype](https://github.com/AmpersandTarski/Prototype) contains `triggerDocsUpdate.yml`, a GitHub Action which triggers `DeployToPages.yml` on a push to the development (main) branch when changes are made to the "docs" folder.

A GitHub Action can be called from an Action in a different Repository when the target Action contains: 
```
on:
  workflow_dispatch:
```
The workflow can then be triggered by a different workflow with the following code:

```
# Workflow which triggers the workflow in DocuGen on changes to "Docs"
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
    # Trigger the "DeployToPages" workflow in the "DocuGen" repository
      - run: |
          curl -XPOST -u "${{secrets.PAT_USERNAME}}:${{secrets.PAT_TOKEN}}" \
          -H "Accept: application/vnd.github.everest-preview+json" -H \
          "Content-Type: application/json" https://api.github.com/repos/AmpersandTarski/DocuGen/actions/workflows/DeployToPages.yml/dispatches \
          --data '{"ref": "main"}'
```
