import { hideBin } from 'yargs/helpers'
import yargs from 'yargs/yargs'
import { reposCursorMgr } from './query'
import JSON5 from 'json5'

const argv = yargs(hideBin(process.argv)).argv
const noop = (_: string) => {}

const instructions = `
Usage:

    node index.ts --org <orgName> --pat <pat> [options]

    Required:
    --org <orgName> - The name of the organization to query
    --pat <pat> - The personal access token to use for authentication

    Optional:
    --verbose <true|false> - Whether to print verbose output. Defaults to false.
    --max <number> - The maximum number of items to return. Defaults to 1. -1 means all.
    --page <number> - The number of items to return per page. Defaults to 10.
    --delay <number> - The number of milliseconds to delay between requests. Defaults to 900.

`

async function main() {
  if (argv['org']) {
    // required
    const orgName = argv['org']
    const pat = argv['pat']

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

      const result = await reposCursorMgr(
        pat,
        url,
        orgName,
        maxItems,
        page,
        delay,
        log
      )

      console.log(JSON.stringify(result))
    }
  } else {
    console.log(instructions)
  }
}
main()
  .then()
  .catch((err) => console.log(err))
