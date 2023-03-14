import { reposQueryGraphQlSDK } from './sdkQuery'
import { getNextCursor, shouldGetNextPage } from './utils/cursor'
import { waitfor } from './utils/utils'
/**
 * Org Repos extended (last commit, pr, issue)
 * @param sdk
 * @param pat
 * @param org_name such as 'Azure-samples'
 * @max_data how many repos to return, -1 means all
 * @page_size 100 items max for GiHub
 * @rate_limit_ms impose rate limit for query
 * @returns
 */
export async function reposCursorMgr(
  pat: string,
  gitHubGraphQLUrl: string,
  org_name: string,
  max_data: number, // Number of repos to return in total, -1 means all data
  page_size: number, // Max page size for GitHub
  rate_limit_ms: number,
  log: (msg: string) => void
): Promise<any[]> {
  if (!gitHubGraphQLUrl)
    throw new Error(
      'reposCursorMgr gitHubGraphQLOrgRepos::missing gitHubGraphQLUrl'
    )
  if (!pat) throw new Error('reposCursorMgr gitHubGraphQLOrgRepos::missing pat')
  if (!org_name)
    throw new Error('reposCursorMgr gitHubGraphQLOrgRepos::missing org_name')

  const variables: any = {
    organization: org_name,
    pageSize: page_size,
    after: null
  }
  log(`created variables`)

  let hasNextPage = false
  let currentData = 0
  let currentPage = 0
  const reposList: any[] = []

  do {
    log(`variables ${JSON.stringify(variables)}`)
    const data = await reposQueryGraphQlSDK(gitHubGraphQLUrl, pat, variables)
    log(`data returned`)
    currentPage += 1

    // Get repos
    if (data?.organization?.repositories?.edges) {
      const reposExtendedDirty = data?.organization.repositories.edges.map(
        (edge) => {
          // elevate nested data
          const node = edge?.node

          // TBD: fix type in GraphQL schema then fix here
          if (node?.languages?.edges) {
            // @ts-ignore
            node['languages'] = node?.languages?.edges?.map((n) => n.node.name)
          }
          // @ts-ignore
          node['weight'] = 0

          if (
            node?.watchers?.totalCount &&
            node?.stargazers?.totalCount &&
            node?.forks &&
            node?.open_issues &&
            node?.open_prs
          ) {
            node['weight'] =
              node?.watchers?.totalCount +
              node?.stargazers?.totalCount +
              node?.forks?.totalCount +
              node?.open_issues?.totalCount +
              node?.open_prs?.totalCount
          }

          if (node) {
            // TBD: fix type in GraphQL schema then fix here
            // @ts-ignore
            node['watchers'] = node?.watchers?.totalCount || 0
            node['weight'] += node['watchers']
            // @ts-ignore
            node['stargazers'] = node?.stargazers?.totalCount || 0
            node['weight'] += node['stargazers']
            // @ts-ignore
            node['forks'] = node?.forks?.totalCount || 0
            node['weight'] += node['forks']
            // @ts-ignore
            node['open_issues'] = node?.open_issues?.totalCount || 0
            node['weight'] += node['open_issues']
            // @ts-ignore
            node['open_prs'] = node?.open_prs?.totalCount || 0
            node['weight'] += node['open_prs']
          }

          return node
        }
      )

      reposList.push(...reposExtendedDirty)
      // Manage cursor for next page
      variables.after = getNextCursor(
        data?.organization?.repositories?.pageInfo?.endCursor
      )
      currentData += reposExtendedDirty.length
      if (variables.after === undefined) {
        log(
          `totalitems: ${currentData}, page: ${currentPage}, hasNextPage: ${hasNextPage}, cursor- === undefined`
        )
        break
      }
      if (max_data !== -1 && currentData > max_data) {
        log(
          `totalitems: ${currentData}, page: ${currentPage}, hasNextPage: ${hasNextPage}, max_data reached`
        )
        break
      }

      // Collect enough data?
      hasNextPage = shouldGetNextPage(
        currentData,
        max_data,
        data.organization?.repositories.pageInfo.hasNextPage,
        data?.organization?.repositories?.pageInfo?.endCursor
      )
      log(
        `totalitems: ${currentData}, page: ${currentPage}, hasNextPage: ${hasNextPage}, cursor: ${variables.after}`
      )

      // rate limit - TBD: Fix this
      if (hasNextPage && rate_limit_ms > 0) {
        log(`waiting ${rate_limit_ms}`)
        await waitfor(rate_limit_ms)
      }
    } else {
      log(`edges not returned`)
    }
  } while (hasNextPage)

  // Sort by weight descending
  reposList.sort((a, b) => parseFloat(b.weight) - parseFloat(a.weight))

  log(`paging finished`)
  return reposList
}
