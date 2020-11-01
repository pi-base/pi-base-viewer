export type Event =
  | { event: 'remote_fetch_started'; host: string; branch: string }
  | { event: 'remote_fetch_complete'; result: unknown }
  | { event: 'bundle_unchanged'; etag: string }
  | { event: 'checkout'; branch: string }
  | { event: 'set_host'; host: string }

export function trace(payload: Event, log = console.log) {
  const { event, ...rest } = payload

  switch (event) {
    case 'remote_fetch_started':
      return log('Syncing with remote', rest)
    case 'remote_fetch_complete':
      return log('Fetched', rest)
    case 'bundle_unchanged':
      return log('Local bundle is up to date', rest)
    case 'checkout':
      return log('Checking out', rest)
    case 'set_host':
      return log('Setting host', rest)
  }
}
