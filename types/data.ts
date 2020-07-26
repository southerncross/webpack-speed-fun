export type UserInfo = {
  username: string,
}

export type PlatformInfo = {
  platform: string,
  cpu: string,
  memory: number,
}

export type BuildInfo = {
  workingDir: string,
  bundleSize: number,
  buildTime: number,
}
