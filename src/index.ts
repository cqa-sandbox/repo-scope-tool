import { hideBin } from 'yargs/helpers'
import yargs from 'yargs/yargs'
import { reposCursorMgr } from './query'
import fs from 'fs/promises'
import path from 'path'

const argv = yargs(hideBin(process.argv)).argv
const noop = (_: string) => {}

const instructions = `
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

`

async function main() {
  if (argv['org'] && (argv['pat'] || process.env.PAT)) {
    // required
    const orgName = argv['org']
    const pat = argv['pat'] || process.env.PAT

    // optional
    const verbose = argv['verbose'] || false
    const maxItems = argv['max'] || 1
    const page = argv['page'] || 10
    const delay = argv['delay'] || 900

    const log = !verbose ? noop : verbose === 'true' ? console.log : noop
    const errors: string[] = []

    if (!orgName) {
      errors.push('orgName is required')
    }

    if (!pat) {
      errors.push('pat is required')
    }

    if (errors.length > 0) {
      console.log(`Error: ${errors.join(', ')}`)
      console.log(instructions)
    } else {
      const url = 'https://api.github.com/graphql'

      let result = await reposCursorMgr(
        pat,
        url,
        orgName,
        maxItems,
        page,
        delay,
        log
      )

      if (maxItems !== -1) {
        result = result.slice(0, maxItems)
        log(`Returning ${result.length} items`)
      }

      const prop = argv['prop'] || 'repositoryName'
      if (prop !== 'all') {
        result = result.map((x) => x.repositoryName)
        log(`Returning '${prop}' property values`)
      }

      const file = argv['file']
      if (file) {
        const fileWithPath = path.join(__dirname, `../${file}`)
        await fs.writeFile(fileWithPath, JSON.stringify(result, null, 2))
        log(`Wrote output to ${fileWithPath}`)
      } else {
        log(`Output to console`)
        console.log(JSON.stringify(result))
      }
    }
  } else {
    console.log(instructions)
  }
}
main()
  .then()
  .catch((err) => console.log(err))
