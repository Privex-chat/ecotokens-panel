export function joinPath(base: string, ...parts: string[]) {
  const separator = base.includes('\\') && base.lastIndexOf('\\') > base.lastIndexOf('/') ? '\\' : '/'
  const trimmedBase = base.replace(/[\\/]+$/, '')
  const root = trimmedBase || (base.startsWith('/') ? '/' : base.startsWith('\\') ? '\\' : '')
  const cleanParts = parts.map(part => part.replace(/^[\\/]+|[\\/]+$/g, '')).filter(Boolean)
  if (!root) return cleanParts.join(separator)

  return root.endsWith(separator) ? root + cleanParts.join(separator) : [root, ...cleanParts].join(separator)
}

function normalizedPath(value: string) {
  return value.replaceAll('\\', '/').replace(/\/{2,}/g, '/').replace(/\/$/, '')
}

export function samePath(left: string, right: string) {
  const a = normalizedPath(left)
  const b = normalizedPath(right)
  const windowsPath = /^[a-z]:\//i.test(a) || /^[a-z]:\//i.test(b) || left.includes('\\') || right.includes('\\')

  return windowsPath ? a.toLowerCase() === b.toLowerCase() : a === b
}

export function pathBelow(path: string, parent: string) {
  const child = normalizedPath(path)
  const root = normalizedPath(parent)
  const windowsPath = /^[a-z]:\//i.test(child) || /^[a-z]:\//i.test(root) || path.includes('\\') || parent.includes('\\')
  const normalizedChild = windowsPath ? child.toLowerCase() : child
  const normalizedRoot = windowsPath ? root.toLowerCase() : root

  return normalizedChild.startsWith(`${normalizedRoot}/`)
}

export function relativePath(path: string, parent: string) {
  if (samePath(path, parent)) return ''
  if (!pathBelow(path, parent)) return path

  return normalizedPath(path).slice(normalizedPath(parent).length + 1)
}

export function metricsDatabasePath(home: string) {
  return joinPath(home, '.config', 'ecotokens', 'metrics.db')
}

export function ecotokensConfigPath(home: string) {
  return joinPath(home, '.config', 'ecotokens', 'config.json')
}
