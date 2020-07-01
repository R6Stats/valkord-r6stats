import { ValkordCommand, ValkordConfig, ValkordModule, Constructor, env } from '@r6stats/valkord'
import { HelpCommand, InviteCommand, OperatorStatsCommand, PingCommand, StatsCommand } from './commands'

export interface R6StatsModuleConfigOptions {
  r6stats_token: string
}

export class R6StatsModuleConfig extends ValkordConfig<R6StatsModuleConfigOptions> {
  public load = (): R6StatsModuleConfigOptions => ({
    r6stats_token: env('R6STATS_API_TOKEN')
  })
}

export class R6StatsModule extends ValkordModule<R6StatsModuleConfig> {
  public getName = (): string => 'R6Stats'

  public getConfig = (): Constructor<R6StatsModuleConfig> => R6StatsModuleConfig

  public getCommands = (): Constructor<ValkordCommand>[] => [
    PingCommand,
    HelpCommand,
    InviteCommand,
    StatsCommand,
    OperatorStatsCommand,
  ]
}
