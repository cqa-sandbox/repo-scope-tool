export async function waitfor(ms: number): Promise<unknown> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
