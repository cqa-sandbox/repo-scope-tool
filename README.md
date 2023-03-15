# GitHub repo cli

## Instructions

```
Usage:

    node index.ts --org <orgName> --pat <pat> [options]

    Required:
    --org <orgName> - The name of the organization to query. Ex: 'staticwebdev' or 'azure-samples'.
    --pat <pat>     - The personal access token to use for authentication. Or process.env.PAT.

    Optional:
    --verbose <true|false> - Whether to print verbose output. Defaults to false.
    --max <number>         - The maximum number of items to return, sorted by weight. Defaults to 1. -1 means all.
    --page <number>        - The number of items to return per page. Defaults to 10.
    --delay <number>       - The number of milliseconds to delay between requests. Defaults to 900.
    --prop <string>        - The property to return. Defaults to 'repositoryName'. 'all' means return all properties.
    --file <string>        - The file to write the output to. 
```

## Example usage - full JSON

```
node ./dist/index.js --org azure-samples --verbose true --max -1 --prop all --file azure-samples.json --page 100 --pat ghp_scy...
```

Returns full JSON object for each repo

```
[
    {
    "repositoryName": "blazor-starter",
    "id": "MDEwOlJlcG9zaXRvcnkyOTczNDcwNzQ=",
    "url": "https://github.com/staticwebdev/blazor-starter",
    "descriptionHTML": "<div>A starter template in C# APIs and Blazor for Azure Static Web Apps</div>",
    "isArchived": false,
    "isEmpty": false,
    "isPrivate": false,
    "isTemplate": true,
    "isDisabled": false,
    "createdAt": "2020-09-21T13:24:51Z",
    "updatedAt": "2023-03-14T01:43:41Z",
    "pushedAt": "2023-02-03T09:32:53Z",
    "diskUsage": 385,
    "languages": [
      "C#",
      "HTML",
      "CSS"
    ],
    "watchers": 12,
    "stargazers": 170,
    "forks": 82,
    "open_issues": 5,
    "open_prs": 2,
    "weight": 542
  }
]
```

## Example usage - repo Array

Return array of repo names sorted by weight desc. 

```
node ./dist/index.js --org staticwebdev --verbose true --max -1 --prop repositoryName --file staticwebdev-reponames.json --page 100 --pat ghp_scy...
```

```
[
  "blazor-starter",
  "vanilla-basic",
  "awesome-azure-static-web-apps",
  "30DaysOfSWA",
  "angular-basic",
  "StartupAdventurer",
  "nuxtjs-starter",
  "react-basic",
  "nextjs-starter",
  "vanilla-api",
  "mongoose-starter",
  "roles-function",
  "vue-basic",
  "blazor-basic",
  "nuxt-3-starter",
  "svelte-basic",
  ".github"
]
```