import { ValkordConfig, env, Injectable } from '@r6stats/valkord'

@Injectable()
export class R6StatsModuleConfig extends ValkordConfig<R6StatsModuleConfigOptions> {
  public load = (): R6StatsModuleConfigOptions => ({
    r6stats_token: env('R6STATS_API_TOKEN')
  })
}

export interface R6StatsModuleConfigOptions {
  r6stats_token: string
}
