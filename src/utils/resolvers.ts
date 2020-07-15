export type Resolvable<T> = ResolvableMap<T>[]

export interface ResolvableMap<T> {
  value: T
  aliases: string[]
}

export const resolve = <T>(input: string, resolvable: Resolvable<T>): T | null => {
  return resolvable.find(r => r.aliases.includes(input.toLowerCase()))?.value
}

export const getPlatformImage = (platform: string): string => {
  switch (platform) {
    case 'pc':
      return 'https://cdn.r6stats.com/platforms/pc.png'
    case 'xbox':
      return 'https://cdn.r6stats.com/platforms/xbox.png'
    case 'ps4':
      return 'https://cdn.r6stats.com/platforms/ps4.png'
  }
}
