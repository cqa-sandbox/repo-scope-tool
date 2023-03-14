export function getNextCursor(
  nextCursor: string | null | undefined
): string | undefined {
  if (nextCursor !== undefined && nextCursor !== null) {
    return nextCursor
  } else {
    undefined
  }
}
export function shouldGetNextPage(
  currentRowCount: number,
  maxRowCount: number,
  currentNextPageCursor: boolean,
  nextCursor: string | null | undefined
): boolean {
  if (
    maxRowCount === -1 || // get all rows
    (nextCursor &&
      currentRowCount < maxRowCount &&
      currentNextPageCursor !== undefined &&
      currentNextPageCursor === true)
  ) {
    return true
  } else {
    return false
  }
}
