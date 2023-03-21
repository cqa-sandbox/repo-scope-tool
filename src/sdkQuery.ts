import { GraphQLClient } from 'graphql-request'
import {
  getSdk,
  IOrgReposQuery,
  IOrgReposQueryVariables,
  Sdk
} from './generated/graphql.sdk'

export type GraphQLResult = { __typename: string }
export type ValueOfTypename<T extends GraphQLResult> = T['__typename']
export function isType<
  Result extends GraphQLResult,
  Typename extends ValueOfTypename<Result>
>(
  result: Result,
  typename: Typename
): result is Extract<Result, { __typename: Typename }> {
  return result?.__typename === typename
}

export async function reposQueryGraphQlSDK(
  gitHubGraphQlUrl: string,
  pat: string,
  variables: IOrgReposQueryVariables
): Promise<IOrgReposQuery> {
  const sdk: Sdk = getSdk(new GraphQLClient(gitHubGraphQlUrl))
  const requestHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${pat}`
  }

  const result = await sdk.OrgRepos(variables, requestHeaders)

  if (result?.organization?.repositories) {
    return result
  }
  // do something with error
  console.log(result)
  return result
}
